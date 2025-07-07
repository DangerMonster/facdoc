# FacDoc Docker Deployment Script (PowerShell)
# Usage: .\deploy.ps1 [start|stop|restart|build|logs|status]

param(
    [Parameter(Position=0)]
    [string]$Command = "start"
)

# Color definitions
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$White = "White"

# Log functions
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Create logs directory
function New-LogsDirectory {
    if (-not (Test-Path "logs")) {
        Write-Info "Creating logs directory..."
        New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    }
}

# Check Docker installation
function Test-DockerInstallation {
    try {
        $dockerVersion = docker --version 2>$null
        if (-not $dockerVersion) {
            throw "Docker not found"
        }
        
        $composeVersion = docker-compose --version 2>$null
        if (-not $composeVersion) {
            throw "Docker Compose not found"
        }
        
        Write-Success "Docker environment verified."
        Write-Info "Docker: $dockerVersion"
        Write-Info "Docker Compose: $composeVersion"
    }
    catch {
        Write-Error "Docker is not installed. Please install Docker Desktop."
        exit 1
    }
}

# Clean up existing containers
function Remove-ExistingContainers {
    Write-Info "Cleaning up existing containers..."
    try {
        docker-compose down --remove-orphans 2>$null
    }
    catch {
        # Ignore
    }
}

# Build Docker image
function Build-DockerImage {
    Write-Info "Building Docker image..."
    docker-compose build --no-cache
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Image build completed."
    } else {
        Write-Error "Image build failed."
        exit 1
    }
}

# Start application
function Start-Application {
    Write-Info "Starting application..."
    New-LogsDirectory
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application started."
        
        # Wait for health check
        Write-Info "Checking application status..."
        Start-Sleep -Seconds 10
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Success "Application is running successfully."
                Write-Info "Access URL: http://localhost:5000"
            }
        }
        catch {
            Write-Warning "Application is starting up. Please check again in a moment."
        }
    } else {
        Write-Error "Failed to start application."
        exit 1
    }
}

# Stop application
function Stop-Application {
    Write-Info "Stopping application..."
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application stopped."
    } else {
        Write-Error "Failed to stop application."
    }
}

# Restart application
function Restart-Application {
    Write-Info "Restarting application..."
    Stop-Application
    Start-Application
}

# Show logs
function Show-Logs {
    Write-Info "Showing application logs..."
    docker-compose logs -f
}

# Show status
function Show-Status {
    Write-Info "Checking application status..."
    docker-compose ps
    
    Write-Host ""
    Write-Info "Container resource usage:"
    try {
        docker stats --no-stream facdoc-app 2>$null
    }
    catch {
        Write-Warning "Container is not running."
    }
}

# Create backup
function Backup-Database {
    Write-Info "Creating database backup..."
    if (Test-Path "backend/database.sqlite") {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupPath = "backend/database.sqlite.backup.$timestamp"
        Copy-Item "backend/database.sqlite" $backupPath
        Write-Success "Database backup completed: $backupPath"
    } else {
        Write-Warning "No database file to backup."
    }
}

# Show help
function Show-Help {
    Write-Host "FacDoc Docker Deployment Script" -ForegroundColor $White
    Write-Host ""
    Write-Host "Usage: .\deploy.ps1 [command]" -ForegroundColor $White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor $White
    Write-Host "  start     - Start application (default)" -ForegroundColor $White
    Write-Host "  stop      - Stop application" -ForegroundColor $White
    Write-Host "  restart   - Restart application" -ForegroundColor $White
    Write-Host "  build     - Build Docker image" -ForegroundColor $White
    Write-Host "  logs      - Show logs" -ForegroundColor $White
    Write-Host "  status    - Show status" -ForegroundColor $White
    Write-Host "  backup    - Backup database" -ForegroundColor $White
    Write-Host "  help      - Show help" -ForegroundColor $White
}

# Main execution logic
try {
    switch ($Command.ToLower()) {
        "start" {
            Test-DockerInstallation
            Remove-ExistingContainers
            Build-DockerImage
            Start-Application
        }
        "stop" {
            Test-DockerInstallation
            Stop-Application
        }
        "restart" {
            Test-DockerInstallation
            Restart-Application
        }
        "build" {
            Test-DockerInstallation
            Remove-ExistingContainers
            Build-DockerImage
        }
        "logs" {
            Test-DockerInstallation
            Show-Logs
        }
        "status" {
            Test-DockerInstallation
            Show-Status
        }
        "backup" {
            Backup-Database
        }
        "help" {
            Show-Help
        }
        default {
            Write-Error "Unknown command: $Command"
            Write-Host "Usage: .\deploy.ps1 [start|stop|restart|build|logs|status|backup|help]" -ForegroundColor $White
            exit 1
        }
    }
}
catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
} 
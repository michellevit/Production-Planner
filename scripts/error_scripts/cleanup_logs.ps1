# cleanup_logs.ps1


$errorLog = "error-log.txt"
$processLog = "process-log.txt"
$daysToKeep = 3
$today = Get-Date

# Function to clean the error log file based on date
function CleanErrorLog {
    $linesToKeep = @()
    Get-Content $errorLog | ForEach-Object {
        $line = $_
        if ($line -match '(\d{2}/\d{2}/\d{2}) (\d{2}:\d{2})') {
            $datePart = $matches[1]
            $timePart = $matches[2]
            $dateTimeString = "$datePart $timePart"
            try {
                $logDate = [DateTime]::ParseExact($dateTimeString, "MM/dd/yy HH:mm", $null)

                $dateDiff = New-TimeSpan -Start $logDate -End $today
                if ($dateDiff.Days -le $daysToKeep) {
                    $linesToKeep += $line
                }
            } catch {
                $linesToKeep += $line
            }
        } else {
            $linesToKeep += $line
        }
    }
    Set-Content $errorLog -Value $linesToKeep
}


# Function to keep only the most recent 20 lines of the check log
function CleanProcessLog {
    $lines = Get-Content $processLog
    $linesCount = $lines.Count
    if ($linesCount -gt 20) {
        $lines = $lines[-20..-1]
    }
    Set-Content $processLog -Value $lines
}


# Clean up the log files
CleanErrorLog
CleanProcessLog
$errorErrorLog = "error-log.txt"
$checkErrorLog = "check-log.txt"
$daysToKeep = 3
$today = Get-Date

# Function to clean the error log file based on date
function Clean-Up-ErrorLog {
    $linesToKeep = @()

    # Read each line in the error log file
    Get-Content $errorErrorLog | ForEach-Object {
        $line = $_
        # Try to extract the date from the line
        if ($line -match '(\d{2}/\d{2}/\d{4}) (\d{2}:\d{2}:\d{2})') {
            # Construct a DateTime object from the log date and time
            $datePart = $matches[1]
            $timePart = $matches[2]
            $dateTimeString = "$datePart $timePart"
            try {
                $logDate = [DateTime]::ParseExact($dateTimeString, "MM/dd/yyyy HH:mm:ss", $null)

                # Compare the date
                $dateDiff = New-TimeSpan -Start $logDate -End $today
                if ($dateDiff.Days -le $daysToKeep) {
                    $linesToKeep += $line
                }
            } catch {
                # If the date parsing fails, keep the line
                $linesToKeep += $line
            }
        } else {
            # If no date found, keep the line
            $linesToKeep += $line
        }
    }

    # Rewrite the error log file with the filtered lines
    Set-Content $errorErrorLog -Value $linesToKeep
}

# Function to keep only the most recent 30 lines of the check log
function Clean-Up-CheckLog {
    $lines = Get-Content $checkErrorLog
    $linesCount = $lines.Count
    if ($linesCount -gt 30) {
        $lines = $lines[-30..-1]
    }
    Set-Content $checkErrorLog -Value $lines
}

# Clean up the log files
Clean-Up-ErrorLog
Clean-Up-CheckLog

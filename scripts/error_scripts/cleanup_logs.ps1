$logFile = "error-log.txt"
$daysToKeep = 3
$today = Get-Date

$linesToKeep = @()

# Read each line in the log file
Get-Content $logFile | ForEach-Object {
    $line = $_
    # Try to extract the date from the line
    if ($line -match '(\d{2}/\d{2}/\d{2}) (\d{2}:\d{2}:\d{2})') {
        # Construct a DateTime object from the log date and time
        $datePart = $matches[1]
        $timePart = $matches[2]
        $dateTimeString = "$datePart $timePart"
        $logDate = [DateTime]::ParseExact($dateTimeString, "MM/dd/yy HH:mm:ss", $null)

        # Compare the date
        $dateDiff = New-TimeSpan -Start $logDate -End $today
        if ($dateDiff.Days -le $daysToKeep) {
            $linesToKeep += $line
        }
    } else {
        # If no date found, keep the line
        $linesToKeep += $line
    }
}

# Rewrite the log file with the filtered lines
Set-Content $logFile -Value $linesToKeep

# This script tests the authentication and event creation APIs

# Step 1: Login as club leader
$loginBody = @{
    username="John Doe"
    password="123"
} | ConvertTo-Json -Compress

Write-Host "Logging in as a club leader..."
$loginResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/auth/login-clubleader" -ContentType "application/json" -Body $loginBody
Write-Host "Login successful!" -ForegroundColor Green
Write-Host "Token received: $($loginResponse.token.Substring(0, 20))..."

# Step 2: Create an event using the token
$token = $loginResponse.token
$eventBody = @{
    name="Test Tech Meetup"
    building="AB1"
    startTime="2025-03-10T10:00:00Z"
    endTime="2025-03-10T12:00:00Z"
    information="A test coding workshop"
    roomno="101"
    categories=@("Tech", "Coding")
} | ConvertTo-Json -Compress

Write-Host "`nCreating a new event..."
try {
    $eventResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/events/create" -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $eventBody
    Write-Host "Event created successfully!" -ForegroundColor Green
    Write-Host "Event details:" -ForegroundColor Cyan
    $eventResponse | ConvertTo-Json | Write-Host
} catch {
    Write-Host "Error creating event:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

# Step 3: Fetch all events
Write-Host "`nFetching all events..."
try {
    $allEvents = Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/events"
    Write-Host "Events fetched successfully!" -ForegroundColor Green
    Write-Host "Number of events: $($allEvents.Length)"
    $allEvents | ForEach-Object { 
        Write-Host "- $($_.name) at $($_.building.name), Room $($_.roomno)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error fetching events:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Add-Type -AssemblyName System.Drawing

$imageDir = "C:\Users\jlren\.gemini\antigravity\scratch\photographer_business_site\images"
$maxWidth = 1920
$quality = 80

$files = Get-ChildItem $imageDir -Filter *.jpg

foreach ($file in $files) {
    try {
        $imgPath = $file.FullName
        Write-Host "Processing $imgPath..."
        
        $img = [System.Drawing.Image]::FromFile($imgPath)
        
        if ($img.Width -gt $maxWidth) {
            $newHeight = [Math]::Floor($img.Height * ($maxWidth / $img.Width))
            $newBitmap = new-object System.Drawing.Bitmap($maxWidth, $newHeight)
            $graph = [System.Drawing.Graphics]::FromImage($newBitmap)
            $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graph.DrawImage($img, 0, 0, $maxWidth, $newHeight)
            
            $img.Dispose() # Release original file handle
            
            # Encoder params for quality
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
            
            $newBitmap.Save($imgPath, $codec, $encParams)
            $newBitmap.Dispose()
            $graph.Dispose()
            
            Write-Host "Resized $file to width $maxWidth"
        } else {
            $img.Dispose()
            Write-Host "Skipping $file (Width: $($img.Width))"
        }
    } catch {
        Write-Error "Failed to process $file : $_"
    }
}

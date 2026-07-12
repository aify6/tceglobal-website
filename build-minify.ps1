<#
.SYNOPSIS
  Generate production-ready static assets for this site.
.DESCRIPTION
  Creates minified CSS and JS copies from the existing source files.
  If ImageMagick is installed and available on PATH, it can also convert
  selected PNG/JPG assets to WebP.
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

function Minify-TextFile {
    param(
        [Parameter(Mandatory)] [string]$Source,
        [Parameter(Mandatory)] [string]$Target
    )

    if (-not (Test-Path $Source)) {
        Write-Warning "Source file not found: $Source"
        return
    }

    $content = Get-Content -Path $Source -Raw
    $content = [regex]::Replace($content, '/\*[\s\S]*?\*/', '')
    $content = [regex]::Replace($content, '\s+', ' ')
    $content = [regex]::Replace($content, '\s*([{};:,>~+])\s*', '$1')
    $content = $content.Trim()

    Set-Content -Path $Target -Value $content -Encoding UTF8
    Write-Host "Created $Target"
}

function Convert-ToWebP {
    param(
        [Parameter(Mandatory)] [string]$Source,
        [Parameter(Mandatory)] [string]$Target
    )

    if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
        Write-Warning "ImageMagick is not installed or not on PATH; skipping WebP conversion."
        return
    }

    if (-not (Test-Path $Source)) {
        Write-Warning "Source image not found: $Source"
        return
    }

    Write-Host "Converting $Source -> $Target"
    magick convert "$Source" -quality 80 "$Target"
}

Minify-TextFile -Source 'assets/css/styles.css' -Target 'assets/css/styles.min.css'
Minify-TextFile -Source 'assets/js/main.js' -Target 'assets/js/main.min.js'

$webpCandidates = @(
    @{ Source = 'assets/images/background.png'; Target = 'assets/images/background.webp' },
    @{ Source = 'assets/images/mandate1.png'; Target = 'assets/images/mandate1.webp' },
    @{ Source = 'assets/images/mandate2.png'; Target = 'assets/images/mandate2.webp' },
    @{ Source = 'assets/images/offering.jpeg'; Target = 'assets/images/offering.webp' }
)

foreach ($item in $webpCandidates) {
    Convert-ToWebP -Source $item.Source -Target $item.Target
}

Write-Host "Build complete."
Write-Host "Use the generated assets by pointing pages to assets/css/styles.min.css and assets/js/main.min.js if desired."

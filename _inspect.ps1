$f = 'c:\laragon\www\my_training_project\index.html'
$lines = Get-Content $f
for ($i = 82; $i -lt 89; $i++) {
    Write-Output ("[{0}][len={1}] {2}" -f $i, $lines[$i].Length, $lines[$i])
}

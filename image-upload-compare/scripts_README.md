

curl -X POST -F "image=@/mnt/f/image-compare/images/blur1.webp" http://localhost:3000/upload

icacls "F:\image-compare\images" /grant Fazaary:"(OI)(CI)F" /T

YOUTUBE_MUSIC_LINK="https://music.youtube.com/watch?v=zuaBRqUBhyw&list=RDAMVM-SttFgyRNCI"

cd /Users/kev/Documents/Music && youtube-dl --audio-quality 0 -i --extract-audio --audio-format mp3 -o './%(title)s.%(ext)s' --add-metadata --embed-thumbnail --metadata-from-title "%(artist)s - %(title)s" ${YOUTUBE_MUSIC_LINK}
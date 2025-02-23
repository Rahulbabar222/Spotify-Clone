//Global variable
let currentSong = new Audio;
let songslist;//aissgned globally for next and previous button
let currFolder;

//converts seconds into mm:ss format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Inserting album cards dynamically
function cardInsert(folder, title, description) {
    const cardContainer = document.getElementsByClassName("cardContainer")[0]; // Access first element

    if (!cardContainer) {
        console.error("cardContainer not found");
        return;
    }

    let card = `<div data-folder="${folder}" class="card">
                    <div class="cover-div">
                        <img class="cover" src="Songs/${folder}/cover.jpg" alt="cover">
                        <button class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="black" fill="black" stroke-width="1.5" stroke-linejoin="round"></path>
                            </svg>
                        </button>  
                    </div>
                    <h3 class="cardHeading">${title}</h3>
                    <p class="cardContent">${description}</p>
                </div>`;

    cardContainer.insertAdjacentHTML("beforeend", card); // Efficient way to insert HTML
}

// populating album content and creating cards
async function disAlbums(){
    let response = await fetch("songs.json");
        let info = await response.json();
        let keys=Object.keys(info);

        keys.forEach(key=>{
            let e=info[key][0];
            if(typeof(e) === "object"){
            cardInsert(key,e["title"],e["description"]);
            }
        })

        
        // getting songs from album to playlist
        Array.from(document.getElementsByClassName("card")).forEach(card => {
            card.addEventListener("click", async (e) => {
                let currAlbum = (e.currentTarget.dataset.folder);
                //updating global play/pause button upon when new album is loaded

                //updating playlist name upon event
                let title=e.currentTarget.querySelector(".cardHeading").textContent;
                document.querySelector(".playlist").textContent= title;

                await getSongs(currAlbum);
             });
         });
}

//Fetch songs form directory and returning songslist
async function getSongs(folder = "default") {
    currFolder = folder;
    try {
        let response = await fetch("songs.json");
        let json = await response.json();
        songslist=[]
        Array.from(json[folder]).forEach(e=>{
            if (typeof e === "string" && e.endsWith(".mp3")) {
                songslist.push(e);}
        })


        //creating playlist of songs from album
        let playlist = document.querySelector(".library-list").getElementsByTagName("ul")[0];
        playlist.innerHTML = "";//emptying playlist before updating
        for (const song of songslist) {
            let refined_name=song.split("/")[2].replace(".mp3","");
            playlist.innerHTML += `<li class=" flex items-center">
        <svg class="musicicon invert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" color="#000000" fill="none">
            <path d="M7 9.5C7 10.8807 5.88071 12 4.5 12C3.11929 12 2 10.8807 2 9.5C2 8.11929 3.11929 7 4.5 7C5.88071 7 7 8.11929 7 9.5ZM7 9.5V2C7.33333 2.5 7.6 4.6 10 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="10.5" cy="19.5" r="2.5" stroke="currentColor" stroke-width="1.5" />
            <circle cx="20" cy="18" r="2" stroke="currentColor" stroke-width="1.5" />
            <path d="M13 19.5L13 11C13 10.09 13 9.63502 13.2466 9.35248C13.4932 9.06993 13.9938 9.00163 14.9949 8.86504C18.0085 8.45385 20.2013 7.19797 21.3696 6.42937C21.6498 6.24509 21.7898 6.15295 21.8949 6.20961C22 6.26627 22 6.43179 22 6.76283V17.9259" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13 13C17.8 13 21 10.6667 22 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="songInfo">${refined_name}</div>
        <div class="playPauseIcon"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
                </svg></div>
         </li>`;
        }

         //attaching event listerner to each song in playlist
         Array.from(document.querySelector(".library-list").getElementsByTagName("li")).forEach(e => {
             e.addEventListener("click", element => {

            let song_fullname=e.querySelector(".songInfo").innerHTML
            console.log(`Playing : ${song_fullname}`);

            let song_src=`Songs/${currFolder}/` + song_fullname + ".mp3"
            playMusic(song_src);

            // Reset all play/pause icons in the song list
            document.querySelectorAll(".playPauseIcon").forEach(icon => {
                icon.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="currentColor" />
                </svg>`;
            });

            //Changes playe icon to pause icon
            let playPauseleft = e.querySelector(".playPauseIcon");
            playPauseleft.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="limegreen" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                    <path d="M9.5 9L9.5 15M14.5 9V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>`;
             })
         });

        return songslist; // Return if calling this function elsewhere
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}




//Music play fucntion takes global variable currentSong defined at top
function playMusic(song, pause = false) {
    currentSong.src = song;

    if (!pause) {
        currentSong.play();
        //Changes icon upon song played
        let playPauseButton = document.querySelector(".playPauseButton");
        playPauseButton.innerHTML = `
                <path fill="none" d="M0 0h48v48H0z"></path>
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-2 28h-4V16h4v16zm8 0h-4V16h4v16z" fill="#ffffff" class="color000000 svgShape"></path>
                `;
        playPauseButton.setAttribute("id", "pause");
    }
        

    //Update song in control panel
    document.querySelector(".currentSongInfo").innerHTML = `<div class="playing">Playing<img src="/asset/music.gif" width="40px" alt=""></div>
            <div class="displayName">${song.split("/")[2].replace(".mp3","")}</div>`;

}

async function main() {  
    //preload default playlist and makes sure even when playlist is toggled between,
    //played music keep playing.
    default_playlist=await getSongs();

    //because default_playlist[0] fetches full path hence split for the name only
    playMusic(default_playlist[0],true);

    //Call function to populate albums
    disAlbums();
    
    // Toggle global play/pause button
    let playPauseButton = document.querySelector(".playPauseButton");
    playPauseButton.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playPauseButton.innerHTML = `
        <path fill="none" d="M0 0h48v48H0z"></path>
        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-2 28h-4V16h4v16zm8 0h-4V16h4v16z" fill="#ffffff" class="color000000 svgShape"></path>
        `;
            playPauseButton.setAttribute("id", "pause");
        } else {
            currentSong.pause();
            playPauseButton.innerHTML = `
        <path fill="none" d="M0 0h48v48H0z"></path>
        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-4 29V15l12 9-12 9z" fill="#ffffff" class="color000000 svgShape"></path>
        `;
            playPauseButton.setAttribute("id", "play");
        }

    });



    //Shuffle/Repeat and next song after song ended
    const shuffleBtn=document.querySelector("#shuffle");
    const repeatBtn = document.querySelector("#repeat");

    let isShuffling=false;
    let isRepeating=false;

    // Shuffle Logic
    shuffleBtn.addEventListener("click", ()=> {
        isShuffling = !isShuffling; // Toggle shuffle
        shuffleBtn.style.color = isShuffling ? "limegreen" : "white"; // UI indication
    });

    // Repeat Logic
    repeatBtn.addEventListener("click",()=> {
        isRepeating = !isRepeating; // Toggle repeat
        repeatBtn.style.color = isRepeating ? "limegreen" : "white"; // UI indication
    });
    
    currentSong.addEventListener("ended", function () {
        let currSong="Songs/"+ currentSong.src.split("/Songs/")[1];
        let currentIndex=songslist.indexOf(decodeURI(currSong));
        
        if (isRepeating) {
            currentSong.currentTime = 0; // Restart same song
            currentSong.play();
            
        } else if (isShuffling) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songslist.length);
            } while (randomIndex === currentIndex); // if equal will exit while and again generate random num
            currentIndex = randomIndex;
            playMusic(songslist[currentIndex]);
            
        } else {
            currentIndex = (currentIndex + 1) % songslist.length; //repeat playlist after last song
            playMusic(songslist[currentIndex]);
        }
    });


    

    // Eventlistener to previous button
    let previous = document.querySelector("#previous");
    previous.addEventListener("click", () => {
        console.log("Previous song playing");
        let current="Songs/"+ currentSong.src.split("/Songs/")[1];
        let index = songslist.indexOf(decodeURI(current));
        if (index - 1 >= 0) {
            playMusic(songslist[index - 1]);
        }
        else {
            console.log("This is first song in list");
        }
    });

    // Eventlistener to next button
    let next = document.querySelector("#next");
    next.addEventListener("click", () => {
        console.log("Next song playing");
        
        let current="Songs/"+ currentSong.src.split("/Songs/")[1];
        let index = songslist.indexOf(decodeURI(current));
        if (index + 1 < songslist.length) {
            playMusic(songslist[index + 1]);
        }
        else {
            console.log("This is last song in list");
        }
    });

    //Rendering volume button
    document.querySelector(".volumeBar").addEventListener("change", (e) => {
        currentSong.volume = (e.target.value) / 100;
        console.log(`Volume set to: ${e.target.value} / 100`);
        if (e.target.value == 0) {
            document.querySelector(".mute-unmute").innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                        <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M18 10L22 14M18 14L22 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>`;
        } else {
            document.querySelector(".mute-unmute").innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                        <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17 9C17.6254 9.81968 18 10.8634 18 12C18 13.1366 17.6254 14.1803 17 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20 7C21.2508 8.36613 22 10.1057 22 12C22 13.8943 21.2508 15.6339 20 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>`;
        }
    });

    //eventlistener to mute/unmute
    document.querySelector(".mute-unmute").addEventListener("click", (e) => {
        const mute = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                        <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M18 10L22 14M18 14L22 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                    </svg>`;

        const unmute = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                        <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M17 9C17.6254 9.81968 18 10.8634 18 12C18 13.1366 17.6254 14.1803 17 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M20 7C21.2508 8.36613 22 10.1057 22 12C22 13.8943 21.2508 15.6339 20 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>`;

        if (e.currentTarget.dataset.muted === "false") {
            currentSong.volume = 0.0;
            e.currentTarget.innerHTML = mute;
            e.currentTarget.dataset.muted = "true";
            document.querySelector(".volumeBar").value = 0;
            console.log(`Volume set to: 0 / 100`);
        } else {
            currentSong.volume = 0.1;
            document.querySelector(".volumeBar").value = 10;
            e.currentTarget.innerHTML = unmute;
            e.currentTarget.dataset.muted = "false";
            console.log(`Volume set to: 10 / 100`);
        }
    });


    //Renders duration
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".timeLapsed").innerHTML = secondsToMinutesSeconds(currentSong.currentTime);
        document.querySelector(".totalTime").innerHTML = secondsToMinutesSeconds(currentSong.duration);
        document.querySelector(".seeker").style.left = (currentSong.currentTime / currentSong.duration) * 100 + `%`;
    });

    //seekbar rendring
    let seekbar = document.querySelector(".seekbar");
    seekbar.addEventListener("click", e => {
        //Element.getBoundingClientRect() method returns a DOMRect object providing information about the size 
        // of an element and its position relative to the viewport.
        //offsetX is value of x of click relative to width of seek bar
        let seekbar_val = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".seeker").style.left = seekbar_val + "%";
        currentSong.currentTime = (seekbar_val * currentSong.duration) / 100;
    });

    //placeholder update for search bar upon smaller screen size
    function updatePlaceholder() {
        let inputField = document.querySelector(".textSearch");

        if (window.innerWidth <= 1250) {
            inputField.placeholder = "    Search";
        } else {
            inputField.placeholder = "    What do you want to play today?";
        }
    }
    updatePlaceholder();
    // Listen for window resize
    window.addEventListener("resize", updatePlaceholder);

    //opening hamburger Event listener
    document.querySelector(".hamburger").addEventListener("click", () => {
        const hamButton = document.querySelector(".left");
        if (hamButton.style.left === "0px") {
            hamButton.style.left = "-100%";
        } else {
            hamButton.style.left = "0px";
        }

        //Adding X icon when hamburger is cliked
        document.querySelector(".plus").innerHTML = `<svg class="closeLib" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
            <path d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`;
        
        //Closing hamburger when X is clicked or home is cliked
        document.querySelector(".closeLib").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-100%";
        });

    });

    //menu Event listener
    document.querySelector(".menu").addEventListener("click", () => {
        const navButton = document.querySelector(".nav-button");
    if (navButton.style.right === "0px") {
        navButton.style.right = "-100%";
    } else {
        navButton.style.right = "0px";
    }
    navButton.style.transition = "0.5s linear";
    })

    //Home Button functionality to close both hamburgers
    document.querySelector(".home").addEventListener("click", () => {
        const navButton = document.querySelector(".nav-button");
        const leftPanel = document.querySelector(".left");
    
        const navRight = getComputedStyle(navButton).right;
        const leftPosition = getComputedStyle(leftPanel).left;
    
        if (navRight === "0px") {
            navButton.style.right = "-100%";
        }
        if (leftPosition === "0px") {
            leftPanel.style.left = "-100%";
        }
    });


        //Closing hamburger or menu upon clicking any other part of document
        document.addEventListener("click", function (event) {
            let menu = document.querySelector(".nav-button"); 
            let hamburger = document.querySelector(".left"); 
        
            // Check if the element exists before accessing its style
            if (!hamburger) return;
            if(!menu) return;
        
            // Get the computed style 
            let leftValue = window.getComputedStyle(hamburger).left;
            let rightValue = window.getComputedStyle(menu).right;


            if ((leftValue === "0px" && window.innerWidth < 1024) || (rightValue === "0px" && window.innerWidth < 1024)) {
                if (
                    menu && !menu.contains(event.target) &&
                    hamburger && !hamburger.contains(event.target)
                ) {
                    menu.style.right = "-100%";
                    hamburger.style.left = "-100%"; 
                }
            }
        });
   

    //Adding event listener to your library button for to populate default playlist
    document.querySelector(".library").addEventListener("click",async()=>{
    document.querySelector(".playlist").textContent="Playlist";
    await getSongs();
})
}

main();

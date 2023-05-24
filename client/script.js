import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

// this function is for the starting when the ai is thinking of the content
function loader(element) {
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.';
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300)
}


// function to give a animation of the answer in character one by one
function typeText(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            
        } else {
            clearInterval(interval);
        }
    }, 20)
}

//generating unique id for uniquely defining anything
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}


// function for the differce of display between the ai message and our question
function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
         <div class="chat">
             <div class="profile">
               <img
                  src="${isAi ? bot : user}"
                  alt="${isAi ? 'bot' : 'user'}"
                 />
              </div>
               <div class="message" id=${uniqueId}>${value}</div>
         </div>
        </div>
        `
    )
}

// functionn to submit the question

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // user's chat stripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

    // bot's chatstripe
    const uniqueId = generateUniqueId();

    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);
    const response = await fetch('https://personal-chatgpt-5hdb.onrender.com',{
        method: 'POST',
        headers:{
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })
    clearInterval(loadInterval);
    messageDiv.innerHTML='';
    if(response.ok){
        const data=await response.json();
        const parsedData = data.bot.trim();
        typeText(messageDiv,parsedData);
    }
    else{
        const err = await response.text();
        messageDiv.innerHTML="something went wrong";
        alert(err);
    }
}



form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
})


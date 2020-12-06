

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

var isRecognizing = false;
let recognition = new SpeechRecognition();

recognition.interimResults = false;  // 실시간 분석
recognition.lang = 'ko-KR';


// DOM
var micBtn = $('#micBtnArea');
var naviBoard = $('#naviBoard');
var naviHeader = $('#naviHeader h2');
var naviMenu = $('#naviMenu .list-group');
var statusMsg = $('#statusMsg');
var showTexts = $('#showTexts');
var cntdown = $('#cntdown');

// Start
micBtn.on('click', () => {
    if(micBtn.hasClass('micOn')){
        recognition.stop();
        isRecognizing = false;
        naviBoard.fadeOut(300);
        micToggle();
        return ;
    }
    recognition.start();
    naviBoard.fadeIn(300);
    micToggle();
    isRecognizing = true;
})

// when started
recognition.onstart = function () {
    console.log("음성인식 시작")
}


// processing speech
recognition.onresult = function (event) {
    console.log('You said: ', event.results[0][0].transcript);
    // 결과를 출력 
    var resText = event.results[0][0].transcript;
    //text to sppech 
    // text_to_speech(resText);
    let texts = Array.from(event.results).map(results => results[0].transcript).join("");
    showTexts.text(texts);
    statusMsg.text("음성인식 완료");

    // 결과에 따라 이동
    if(texts){
        let targetPage = '';
        switch(texts){
            case '1번': case '메인화면': case '메인 화면':
                targetPage = '#hero'; break;
            case '2번': case '단체소개': case '단체 소개':
                targetPage = '#about'; break;
            case '3번': case '활동':
                targetPage = '#activity'; break;
            case '4번': case '갤러리':
                targetPage = '#portfolio'; break;
            default:
                recognition.stop();
                statusMsg.text("다시 한 번 말씀해주세요");

                // cnt down
                let _time = 3;
                cntdown.show();
                let cntdownInterval = setInterval(() => {
                    cntdown.text(_time);
                    _time -= 1;
                }, 1000);

                // restart
                setTimeout(() => { 
                    cntdown.hide();
                    clearInterval(cntdownInterval);
                    recognition.start(); }, 4000);
                return ;
        }
        cntdown.hide();
        setTimeout(() => {
            $(`#navbarForClick a[href="${targetPage}"]`).click();
            naviBoard.fadeOut(300);
            micToggle();
        }, 3000);   // 3초 후 이동
    }
};




function micToggle(){
    if( micBtn.hasClass('micOff') ){
        micBtn.removeClass('micOff')
        micBtn.addClass('micOn');
        statusMsg.text("음성인식 중...");        

    } else if(micBtn.hasClass('micOn') ){
        micBtn.removeClass('micOn')
        micBtn.addClass('micOff');
        statusMsg.text("음성인식 대기중입니다");
    }

}

// move page
function movePage(voiceRes){

}


// Text to speech 
function text_to_speech(txt) {
    // Web Speech API - speech synthesis 
    if ('speechSynthesis' in window) {
        // Synthesis support. Make your web apps talk! 
        console.log("음성합성을 지원하는  브라우저입니다.");
    }
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    //msg.voice = voices[10]; // 두번째 부터 완전 외국인 발음이 됨. 사용하지 말것. 
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1 
    msg.rate = 1.3; // 0.1 to 10 
    //msg.pitch = 2; //0 to 2 
    msg.text = txt;
    msg.lang = 'ko-KR';
    msg.onend = function (e) {
        if (isRecognizing == false) {
            recognition.start();
        }
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };
    window.speechSynthesis.speak(msg);
}
"use strict";
class TimerList {
   constructor(timerList, exam) {
      this.timerList = timerList;
      this.exam = exam;
      this.timerCount = 0;
      this.paused = true;
      this.finished = false;
   }

   start() {
      this.paused = false;
   }

   pause() {
      this.paused = true;
   }

   reset() {
      this.timerCount = 0;
      var temp = document.createElement('div');
      temp.innerHTML = document.querySelector('#'+this.exam+'-box-html').innerHTML;
      this.timerList.innerHTML = temp.querySelector('.timer-list').innerHTML;
      this.finished = false;
   }
}

var satCount;
var actCount;
var actnoessayCount;
var psatCount;
var satsubCount;
var ssatulextraCount;
var ssatmlextraCount;
var ssat3_4extraCount;
var lsat50extraCount;
var isee_ml_ul_50Count;
var isee_ml_ul_100Count;

var totalExamCount;

var satButton;
var actButton;
var actnoessayButton;
var psatButton;
var satsubButton;
var ssatulextraButton;
var ssatmlextraButton;
var ssat3_4extraButton;
var lsat50extraButton;
var isee_ml_ul_50Button;
var isee_ml_ul_100Button;

var timerLists = [];
var nextTimerList;

var boxGrid;
var notifBox;

window.onload = init;

var t = window.setInterval(function() {
   const currTimers = [];

   for (var i = 0; i < timerLists.length; i++) {
      let currTimerList = timerLists[i].timerList;
      let currTimerCount = timerLists[i].timerCount;

      //update current timer on all timer lists
      if(!timerLists[i].paused) {
         var currTimer = currTimerList.children[currTimerCount].querySelector('div').children[1];
         currTimers.push(currTimer);

         const timePair = currTimer.textContent.split(':');

         let time = parseInt(timePair[0]) * 60 + parseInt(timePair[1]) - 1;
         let minutes = Math.floor(time / 60);
         let seconds = time - Math.floor(time / 60) * 60;

         currTimer.textContent = seconds < 10 ? minutes+":0"+seconds : minutes+":"+seconds;

         if(time == 0) {
            currTimer.style.color = 'red';

            let timerName = currTimer.parentNode.children[0].textContent;
            appendNotif(timerName, currTimerList.parentNode.querySelector('h2').childNodes[0].nodeValue);
            timerLists[i].timerCount += 1;

            if(currTimerCount == currTimerList.children.length-1) {
               currTimers.pop();
               timerLists[i].finished = true;
               pauseExam(currTimerList.parentNode.querySelector('h2 > button'));
            }
         }
      }

      let currTime = new Date();
      for (var l = currTimerCount; l < currTimerList.children.length; l++) {
         const timePair = currTimerList.children[l].children[0].children[1].textContent.split(':'); //timer time
         let time = parseInt(timePair[0]) * 60 + parseInt(timePair[1]) - 1;

         var timerTextSpan = currTimerList.children[l].children[0].children[0]; //span containing timer name

         currTime.setSeconds(currTime.getSeconds() + time);

         timerTextSpan.textContent = timerTextSpan.textContent.split(',')[0] + ', Ends ' + currTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


      }
   }

   const mins = [];

   for (var k = 0; k < 5; k++) {
      var currMin = 99999;
      var currMinIndex = 0;
      for (var j = 0; j < currTimers.length; j++) {
         const timePair = currTimers[j].textContent.split(':');

         let time = parseInt(timePair[0]) * 60 + parseInt(timePair[1]) - 1;
         if(time < currMin) {
            currMin = time;
            currMinIndex = j;

         }
      }
      if(currMin != 99999) {
         mins.push(currTimers[currMinIndex]);
         currTimers.splice(currMinIndex, 1);
      }
   }


   updateNextTimerList(mins);

}, 1);

function updateNextTimerList(minTimers) {
   var newList = document.createElement('ul');

   for (var i = 0; i < minTimers.length; i++) {
      let listItem = document.createElement('li');
      listItem.innerHTML = minTimers[i].parentNode.parentNode.innerHTML;
      listItem.querySelector('div').querySelector('span').childNodes[0].nodeValue += minTimers[i].parentNode.parentNode.parentNode.parentNode.querySelector('h2').childNodes[0].nodeValue;
      newList.appendChild(listItem);
   }

   if(nextTimerList !== undefined) nextTimerList.innerHTML = newList.innerHTML;
}

function init () {
   satButton = document.getElementById('sat');
   actButton = document.getElementById('act');
   satsubButton = document.getElementById('satsub');
   psatButton = document.getElementById('psat');
   actnoessayButton = document.getElementById('actnoessay');
   ssatulextraButton = document.getElementById('ssatulextra');
   ssatmlextraButton = document.getElementById('ssatmlextra');
   ssat3_4extraButton = document.getElementById('ssat3_4extra');
   lsat50extraButton = document.getElementById('lsat50extra');
   isee_ml_ul_50Button = document.getElementById('isee_ml_ul_50');
   isee_ml_ul_100Button = document.getElementById('isee_ml_ul_100');

   boxGrid = document.getElementById('box-grid');

   notifBox = document.getElementById('notif-box');
   nextTimerList = document.getElementById('next-timer-list');

   timerLists = []

   satCount = 0;
   actCount = 0;
   actnoessayCount = 0;
   psatCount = 0;
   satsubCount = 0;
   ssatulextraCount = 0;
   ssat3_4extraCount = 0;
   lsat50extraCount = 0;
   isee_ml_ul_50Count = 0;
   isee_ml_ul_100Count = 0;

   totalExamCount = 0;


   satButton.addEventListener('click', function() { addExam('sat') });
   actButton.addEventListener('click', function() { addExam('act') });
   actnoessayButton.addEventListener('click', function() { addExam('actnoessay') });
   psatButton.addEventListener('click', function() { addExam('psat') });
   satsubButton.addEventListener('click', function() { addExam('satsub') });
   ssatulextraButton.addEventListener('click', function() { addExam('ssatulextra') });
   ssatmlextraButton.addEventListener('click', function() { addExam('ssatmlextra') });
   ssat3_4extraButton.addEventListener('click', function() { addExam('ssat3_4extra') });
   lsat50extraButton.addEventListener('click', function() { addExam('lsat50extra') });
   isee_ml_ul_50Button.addEventListener('click', function() { addExam('isee_ml_ul_50') });
   isee_ml_ul_100Button.addEventListener('click', function() { addExam('isee_ml_ul_100') });
}

function appendNotif(text, examName) {
   var div = document.createElement('div');

   div.setAttribute('class', 'notif');
   div.innerHTML = document.getElementById('notif-format').innerHTML;

   div.lastChild.textContent = text;

   notifBox.appendChild(div);
   //make modal appear
   document.querySelector('#notif-modal').style.display = 'block';
   document.querySelector('#modal-text').textContent = text+' '+examName+' timer finished';
}

function disappearModal() {
   document.querySelector('#notif-modal').style.display = 'none';
}

function clearNotif(button) {
   button.parentNode.parentNode.remove();
}

function removeExam(exam, callingButton) {
   timerLists.splice(callingButton.parentNode.parentNode.querySelector('.timer-list').getAttribute('data-num')-1, 1);

   shiftTimerListsNums (exam, callingButton.parentNode.parentNode.querySelector('.timer-list').getAttribute('data-num')-1);

   callingButton.parentNode.parentNode.remove();

   eval(exam+'Count--');
   totalExamCount--;
}

function shiftTimerListsNums (exam, startingNum) {
   for (var i = startingNum; i < timerLists.length; i++) {
      let currTimerList = timerLists[i].timerList
      currTimerList.setAttribute('data-num', currTimerList.getAttribute('data-num')-1);
   }
}

function addExam (exam) {
   eval(exam+'Count++');
   totalExamCount++;

   var div = document.createElement('div');

   div.setAttribute('class', 'content-box');
   div.setAttribute('id', exam+'-box-'+eval(exam+'Count'));
   div.innerHTML = document.getElementById(exam+'-box-html').innerHTML;

   div.querySelector('.timer-list').setAttribute('data-num', totalExamCount);
   div.querySelector('h2').textContent = div.querySelector('h2').childNodes[0].nodeValue;
   div.querySelector('h2').innerHTML += '<button id="'+exam+'-start" onclick="startExam(this)"> Start </button> <button id="'+exam+'-remove" onclick="removeExam(\''+exam+'\', this)"> Remove </button>'

   timerLists.push(new TimerList(div.querySelector('.timer-list'), exam));

   boxGrid.appendChild(div);
}

function startExam(callingButton) {
   let timerList = timerLists[callingButton.parentNode.parentNode.querySelector('.timer-list').getAttribute('data-num')-1];
   if(timerList.finished) return;

   timerList.start();

   callingButton.textContent = 'Pause';
   callingButton.setAttribute('onclick', 'pauseExam(this)');
}

function pauseExam(callingButton) {
   timerLists[callingButton.parentNode.parentNode.querySelector('.timer-list').getAttribute('data-num')-1].pause();

   callingButton.textContent = 'Start';
   callingButton.setAttribute('onclick', 'startExam(this)');
}

function resetExam(exam, callingButton){
   timerLists[callingButton.parentNode.querySelector('.timer-list').getAttribute('data-num')-1].reset();
}

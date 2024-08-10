
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".wrapper");  
  const inputPart = wrapper.querySelector(".input-part");
  const infoTxt = inputPart.querySelector(".info-txt");
  const inputField = inputPart.querySelector("input");
  const locationBtn = inputPart.querySelector("button");
  const wIcon = document.querySelector("img");
  const arrowBack = wrapper.querySelector("header i");
  const searchIcon = document.querySelector(".searchIcon");

  let api;

  inputField.addEventListener("keydown", function(e) {
    if(e.keyCode == 13 && inputField.value != ""){
      requestApi(inputField.value);  
    }
  });

  searchIcon.addEventListener("click", e => {
    if (inputField.value === "" || inputField.value.trim() === ""){
      alert("Please enter data in this field");
    } else {
      requestApi(inputField.value);
    }
  });

  locationBtn.addEventListener("click", () => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert("Your browser does not support geolocation API");
    }
  });

  function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8641075dda9ea5d5c961c48c00929bec`;
    fetchData();
  }

  function onSuccess(position){
    const {latitude, longitude} = position.coords; 
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=8641075dda9ea5d5c961c48c00929bec`;
    fetchData();
  }

  function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
  }

  function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
  }

  function weatherDetails(info){
    if(info.cod == "404"){
      infoTxt.classList.replace("pending", "error");
      infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    } else {
      const city = info.name;
      const country = info.sys.country;
      const {description, id} = info.weather[0];
      const {feels_like, humidity, temp} = info.main;

      if(id == 800){
        wIcon.src="https://img.icons8.com/external-kosonicon-flat-kosonicon/64/external-clear-sky-weather-kosonicon-flat-kosonicon.png";
      } else if (id >= 200 && id <=232){
        wIcon.src="https://img.icons8.com/external-flatart-icons-flat-flatarticons/64/external-strom-nature-flatart-icons-flat-flatarticons.png" ;
      } else if (id >= 600 && id <= 622){
        wIcon.src="https://img.icons8.com/color/48/sleet.png";
      } else if (id >= 701 && id <=781){
        wIcon.src="https://img.icons8.com/fluency/48/fog-day.png";
      } else if (id >= 801 && id <=804){
        wIcon.src="https://img.icons8.com/color/48/partly-cloudy-day--v1.png";
      } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
        wIcon.src="https://img.icons8.com/color/48/light-rain--v1.png";
      } 

      wrapper.querySelector(".temp .numb").innerText =  Math.floor(temp);
      wrapper.querySelector(".weather").innerText = description.toUpperCase();
      wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
      wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
      wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

      infoTxt.classList.remove("pending", "error"); 
      infoTxt.innerText = "";
      inputField.value = "";
      wrapper.classList.add("active");
    }
  }

  arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
  });
});

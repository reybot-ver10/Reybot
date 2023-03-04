module.exports = {
  config: {
    name: "weather",
    version: "1.0.0",
    author: { 
      name: "JOHN RÉ", 
      contacts: ""
    },
    cooldowns: 5,
    role: 0,
    shortDescription: "Weather forecast",
    longDescription: "See the weather forecast for 5 days",
    category: "other",
    guide: "{prefix}{name} <Location> ",
    envGlobal: {
      weatherApiKey: "d7e795ae6a0d44aaa8abb1a0a7ac19e4"
    }
  },
  start: async function({ globalGoat, args, message }) {
    const axios = require("axios");
    const apikey = globalGoat.configCommands.envGlobal.weatherApiKey;
    const moment = require("moment-timezone");
    const Canvas = require("canvas");
    const fs = require("fs-extra");
    
    const area = args.join(" ");
    if (!area) return message.reply("Please enter a location");
    let areaKey, location = {}, dataWeather;
    
    try {
      const response = (await axios.get(`https://api.accuweather.com/locations/v1/cities/search.json?q=${encodeURIComponent(area)}&apikey=${apikey}&language=vi-vn`)).data;
      if (response.length == 0) return message.reply(`Không thể tìm thấy địa điểm: ${area}`);
      const data = response[0];
      areaKey = data.Key;
      location = {
        latitude: data.GeoPosition.Latitude,
        longitude: data.GeoPosition.Longitude
      };
    }
    catch (err) {
      return message.reply(`An error occurred: ${err.response.data.Message}`);
    }
    
    try {
      dataWeather = (await axios.get(`http://api.accuweather.com/forecasts/v1/daily/10day/${areaKey}?apikey=${apikey}&details=true&language=en`)).data;
    }
    catch (err) {
      return message.reply(`Error has occured: ${err.response.data.Message}`);
    }
    function convertFtoC(F) {
      return Math.floor((F - 32)/1.8);
    }
    function formatHours(hours) {
      return moment(hours).tz("Asia/Manila").format("HH[h]mm[p]");
    }
    const dataWeatherDaily = dataWeather.DailyForecasts;
    const dataWeatherToday = dataWeatherDaily[0];
    let msg = `Thời tiết hôm nay:\n${dataWeather.Headline.Text}`
    + `\n🌡 Lowest temperature - Highest: ${convertFtoC(dataWeatherToday.Temperature.Minimum.Value)}°C - ${convertFtoC(dataWeatherToday.Temperature.Maximum.Value)}°C`
    + `\n🌡 Feel temperature: ${convertFtoC(dataWeatherToday.RealFeelTemperature.Minimum.Value)}°C - ${convertFtoC(dataWeatherToday.RealFeelTemperature.Maximum.Value)}°C`
    + `\n🌅 Sunrise: ${formatHours(dataWeatherToday.Sun.Rise)}`
    + `\n🌄 Sunset ${formatHours(dataWeatherToday.Sun.Set)}`
    + `\n🌃 Moonrise: ${formatHours(dataWeatherToday.Moon.Rise)}`
    + `\n🏙 Moonset: ${formatHours(dataWeatherToday.Moon.Set)}`
    + `\n🌞 Day: ${dataWeatherToday.Day.LongPhrase}`
    + `\n🌙 Night: ${dataWeatherToday.Night.LongPhrase}`;
    
    Canvas.registerFont(
  		__dirname + "/src/font/BeVietnamPro-SemiBold.ttf", {
  		family: "BeVietnamPro-SemiBold"
  	});
  	Canvas.registerFont(
  		__dirname + "/src/font/BeVietnamPro-Regular.ttf", {
  		family: "BeVietnamPro-Regular"
  	});
    
    const bg = await Canvas.loadImage(__dirname + "/src/image/bgweather.jpg");
    const { width, height } = bg;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext(`2d`);
    ctx.drawImage(bg, 0, 0, width, height);
    let X = 100;
    ctx.fillStyle = "#ffffff";
    const data = dataWeather.DailyForecasts.slice(0, 7);
    for (let item of data) {
  	  const icon = await Canvas.loadImage("http://vortex.accuweather.com/adc2010/images/slate/icons/" + item.Day.Icon + ".svg");
  	  ctx.drawImage(icon, X, 210, 80, 80);
  	  
  		ctx.font = "30px BeVietnamPro-SemiBold";
  		const maxC = `${convertFtoC(item.Temperature.Maximum.Value)}°C `;
  		ctx.fillText(maxC, X, 366);
  
  		ctx.font = "30px BeVietnamPro-Regular";
  		const minC = String(`${convertFtoC(item.Temperature.Minimum.Value)}°C`);
  		const day = moment(item.Date).format("DD");
  		ctx.fillText(minC, X, 445);
  		ctx.fillText(day, X+20, 140);
  		
  	  X += 135;
  	}
  	const pathSaveImg = __dirname+"/cache/weather.jpg";
    fs.writeFileSync(pathSaveImg, canvas.toBuffer());
  
    return message.reply({
      body: msg,
      attachment: fs.createReadStream(pathSaveImg)
    }, () => fs.unlinkSync(pathSaveImg));
    
  }
};
const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=fcb4a1086cd97653b1ca99d779141573&query=' + latitude + ',' + longitude;
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service', undefined);
        } else if (body.error) {
            callback(body.error.info, undefined);
        } else {
            callback(undefined, {
                descriptions: body.current.weather_descriptions,
                temperature: body.current.temperature,
                humidity: body.current.humidity,
                feelslike: body.current.feelslike
            })
        }
    });
};

module.exports = forecast;
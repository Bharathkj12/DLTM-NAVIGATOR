# Dubai DLTM Navigator

Convert Dubai Local Transverse Mercator (DLTM) coordinates to standard GPS (WGS84) and visualize them on Google Maps or share via WhatsApp.

## Features

- **Coordinate Conversion**: Accurately converts Easting/Northing (DLTM) to Latitude/Longitude (WGS84).
- **Interactive UI**: Clean, modern interface with instant feedback.
- **Google Maps Integration**: Open converted coordinates directly in Google Maps.
- **WhatsApp Sharing**: Share location with a single click.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## technical Details

- **Projection**: Uses `proj4js` with the specific DLTM projection string:
  `+proj=tmerc +lat_0=0 +lon_0=55.3333333333333 +k=1 +x_0=500000 +y_0=0 +datum=WGS84 +units=m +no_defs`
- **Stack**: standard HTML5, CSS3, and Vanilla JavaScript.

## Usage

1.  Enter **Easting (X)** and **Northing (Y)** coordinates.
2.  Click **Convert Coordinates**.
3.  View the resulting Latitude and Longitude.
4.  Use the action buttons to **Open in Google Maps** or **Share on WhatsApp**.

## Credits

Created by Bharath KJ | Powered by ARAR UTILITY

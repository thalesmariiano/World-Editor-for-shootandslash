# World Editor for <a href="https://github.com/thalesmariiano/Shoot-And-Slash">Shoot And Slash</a>

I created this map editor for make the shoot and slash development more easy.
-

For run the project:
```
npm install
npm run server
```
- localhost:3072 

After save the map, you will receive a json file with a tileset array like that:

> (but, not formated like that)
```json
{
  "name":"tileMap789",
  "size":{
    "width":2000,
    "height":800
  },
  "save_date":"2025-02-27T01:35:48.281Z",
  "tiles": [
    {
      "width":50,
      "height":50,
      "imgX":0,
      "imgY":0,
      "position": {
          "x":50,
          "y":500
      },
      "type":"Block",
      "visible":false
    } 
  ]
}
```


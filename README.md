## Welcome to SeTA-UI!

**SeTA** - *Semantic Text Analyser* - is a new tool that applies advanced text analysis techniques to large document collections, helping policy analysts to understand the concepts expressed in thousands of documents and to see in a visual manner the relationships between these concepts and their development over time.
  

## Docker Build

`cd ./seta-compose`
`docker-compose build`
`docker-compose up`
  

It will setup all system and data.
It will take a while depending on the Internet speed. Might take 30min to 2h.
At some point there will be a message "SeTA-API is up and running."
The build of seta-ui-spa container will need about 10 minutes to complete and see the result in the output folder 'seta-ui\seta-flask-server\seta-ui'
After that you are ready to open your browser and start typing:
for UI: http://localhost/seta-ui
for API documentation: http://localhost/seta-api/doc
  

Stop services gracefully: 
`CTRL + C`
  

If you started in detached mode (`docker-compose up -d`) you can stop services with  

`docker-compose down`
  

#Minimum requirements

 - at least 10GB available free RAM;
 - 16 GR (32GB prefered) RAM; 
 - 100GB free space HDD or SSD (preferred);
 - good Internet speed - download at least 5GB (> 20GB for all data)

The first run will take time. The next run will be fast.
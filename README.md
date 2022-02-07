# fitbit-to-strava

#### Objective: Integrate various datasets to derive full [Strava](https://www.strava.com)-uploadable entries with GPS and heart rate data for ~1100 barebones, GPS and HRless Fitbit exercises.  

#### Datasets at hand, some available from Fitbit's [export option](https://help.fitbit.com/articles/en_US/Help_article/1133.htm): 
- Exercise data: Biking, Walking, and other types of workouts recorded with Fitbit Charge HR from 2016-2020.  ~2300 activities, 1164 of which are bike rides. All have distances manually entered based, on me using Google Maps to understand how far I biked to that destination.  I clearly should have just bought an apple watch 
- Heartrate data: Readings every 10, 20 seconds, uncorrelated to the exercises entries.  ~14million records, which I indexed into Elasticsearch database for easy searching and timestamp-range retrieval based on when a given bike ride began+ended.  These came packaged in ~1400 JSON files, each with 8K+ records per, so clearly any programmatic searching/linking to rides/retrieval would involve indexing them in a database first 
- Rudimentary Apple Notes document linking a given distance (5.9mi, say) to a specific destination (in total, about 30-40 destinations).  Each exercise has a corresponding distance, hence my ability to derive a destination.
- Calendar data, it's possible that I recorded where I was in iCal     

_Overview sequence diagram showing entire flow_
![Untitled-2](https://user-images.githubusercontent.com/16728311/152732644-3f2e26f5-4459-462c-bfe2-a52bb5f4f29b.svg)

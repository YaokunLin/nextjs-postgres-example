# TWU Project - Live Website

in the sample starter code:
"patrick@email.com" is the administrator  and
"john@email.com" is the regular user

Feel free to try upload the "sample_puzzle.txt" file found in the root dir to the website

![image](https://github.com/BCDevExchange-CodeChallenge/cc-twu-FIN-lime/assets/72329369/96571eb1-5bbb-40df-9ce5-f850e4eeaf51)

# TWU Project - Local Deployment Guide

The following guide provides instructions on how to manage the Docker containers for the TWU Project locally.

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Starting the Containers

1. Navigate to the project root directory.
2. Run the following command:

   ```bash
   docker-compose -p twuproject up -d
   ``` 
This will start the containers in detached mode (running in the background).
Then you can go to [http://localhost:3000/](http://localhost:3000/) and you can try upload the sample csv file called `PayTransparency_TWU_Code _Challenge_Samplefile.csv`, which can be found in the root of the repo directory


## Stopping the Containers

1. Navigate to the project root directory.
2. Run the following command:

   ```bash
   docker-compose -p twuproject down
   ```  
## Viewing Logs
If you wish to view the logs of the running containers, use the following command:

   ```bash
   docker-compose -p twuproject logs
   ``` 
To view logs for a specific container (options include `api`, `app`, `database`), run:

   ```bash
   docker-compose -p twuproject logs api
   ``` 

## Cleaning Up Database Data
To clean up or reset the database data:
1. Stop the containers:
   ```bash
   docker-compose -p twuproject down
   ``` 
2. Remove the database volume:
   ```bash
   docker volume rm twuproject_db-data
   ```

## Re-initializing the Database
After cleaning up the database data, simply start the containers again. The database will be re-initialized using the initialization scripts:
   ```bash
   docker-compose -p twuproject up -d
   ```

## Additional Commands
To list the running containers:
   ```bash
   docker-compose -p twuproject ps
   ```
To execute commands inside a specific container (e.g., `database`):
   ```bash
   docker exec -it database bash
   ```

## Troubleshooting
If you encounter issues, ensure:

- Docker is running on your machine.
- Ports specified in docker-compose.yml are available and not in use by other services.

## License
This project is licensed under the [Apache 2.0](LICENSE) license. 

## Secretes
For this code challange, secretes and credentials were hard coded for making the evlautions easier. However, this is not recommended in a real world project.


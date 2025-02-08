rm -rf build

# Build the FE and move the built files to the /server folder 
cd ../client

# Install the dependencies
npm install 

# Build the FE 
npm run build

# Move the built files to the /server folder
mv build ../server

# Build the docker image 
cd ../server

# Install the dependencies
npm install

# Build the server
npm run build

# Build the docker image
docker build -t your-docker-image-tag .

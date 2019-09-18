FROM node:10.13-alpine
RUN npm install -g create-react-app \
                   create-react-native-app \
                   react-native-cli
RUN mkdir /app
WORKDIR /app
ADD . /app
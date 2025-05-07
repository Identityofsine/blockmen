FROM ubuntu/nginx:latest

# Set build args 
ARG BUILD_DATE
ARG BUILD_ID
ARG BRANCH

# Set as environment variables (available during build and runtime)
ENV VITE_BUILD_DATE=$BUILD_DATE
ENV VITE_BUILD_ID=$BUILD_ID
ENV VITE_BRANCH=$BRANCH


# set work dir
WORKDIR /usr/src/app

# install dependencies
RUN apt update

# Installs Node.js and npm
RUN apt-get install -y npm 
RUN apt-get install -y curl
RUN apt-get install -y wget 

RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash 
RUN . ~/.nvm/nvm.sh && nvm install 20.0.0


COPY ./nginx/sites-available/web.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/sites-available/web.conf /etc/nginx/sites-available/default

COPY . .

RUN npm install -g typescript
RUN npm install -g vite
RUN npm i 

RUN ./build.sh

# expose port
EXPOSE 9091

#ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [""]





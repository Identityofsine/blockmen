FROM python:latest

# Set build args 
ARG BUILD_DATE
ARG BUILD_ID
ARG BRANCH

# Set as environment variables (available during build and runtime)
ENV BUILD_DATE=$BUILD_DATE
ENV BUILD_ID=$BUILD_ID
ENV BRANCH=$BRANCH

# set work dir
WORKDIR /usr/src/app

# install dependencies
RUN apt update

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

# expose port
EXPOSE 9090 

ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [""]

#CMD ["python", "src/blockmen/__init__.py"]



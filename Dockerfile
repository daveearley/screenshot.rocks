FROM node AS build

ADD ./ /app
WORKDIR /app
RUN npm install && npm run build

FROM node 

EXPOSE 5000
COPY --from=build /app/build /app
RUN npm install -g serve

CMD serve -s /app

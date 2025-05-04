npm i
npm install typescript -g
npm install vite -g

ls $(pwd) 

tsc -b && VITE_BRANCH=$VITE_BRANCH VITE_BUILD_ID=$VITE_BUILD_ID VITE_BUILD_DATE=$VITE_BUILD_DATE  vite build


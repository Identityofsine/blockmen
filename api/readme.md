# API

## Installation

Make sure to install the required packages in a virtual environment.

2. Create a virtual environment:
```bash
python -m venv venv
```

This will create a new directory called `venv` in your project folder.

3. Activate the virtual environment:
- On Windows:
```bash
.\venv\Scripts\activate
```
- On macOS and Linux:
```bash
source venv/bin/activate
```

4. Install the required packages:
```bash
pip install -r requirements.txt
```

> Note: You will need to have npm and node installed to run the dev server properly.

5. Install nodemon
```bash
npm install -g nodemon
```

## Usage
2. Start the server:

```bash
./start_dev.sh
```

3. Open your browser and go to `http://localhost:8000` to see the API in action.

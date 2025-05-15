import json
from typing import Dict, Any, Tuple
from pathlib import Path
from jsonschema import validate, ValidationError
from service.logger import logDebug, logWarning, logError

# Validator class for validating JSON requests against predefined schemas.
# This class loads schemas from a directory and validates incoming requests.

class Validator:
    _schemas: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def load_schema(cls, schema_name: str) -> Dict[str, Any]:
        if schema_name in cls._schemas:
            return cls._schemas[schema_name]
        
        schemas_dir = Path(__file__).parent / "schemas"
        schema_file = schemas_dir / f"{schema_name}.json"
        
        if not schema_file.exists():
            logWarning(f"Schema file not found: {schema_file}")
            return None
        
        try:
            with open(schema_file, 'r') as f:
                schema = json.load(f)
                cls._schemas[schema_name] = schema
                logDebug(f"Loaded schema: {schema_name}")
                return schema
        except Exception as e:
            logError(f"Error loading schema {schema_name}: {e}")
            return None
    
    @classmethod
    def validate_request(cls, request: Any) -> Tuple[bool, Any]:
        if not isinstance(request, dict):
            return False, "Request must be a JSON object"
        
        if 'type' not in request:
            return False, "Request must specify a 'type' field"
        
        request_type = request['type']
        schema = cls.load_schema(request_type)
        
        if schema is None:
            return False, f"Unknown request type: {request_type}"
        
        try:
            validate(instance=request, schema=schema)
            logDebug(f"Request validated successfully: {request_type}")
            return True, request
    
        except ValidationError as e:
            logWarning(f"Validation failed for request type {request_type}: {e.message}")
            return False, f"Invalid request: {e.message}"
        
        except Exception as e:
            logError(f"Unexpected error during validation: {e}")
            return False, f"Validation error: {str(e)}"

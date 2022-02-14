lint:
	@echo "Running isort, black, and prettier"
	@find . -name "*.py" ! -name "*_pb2*" ! -path "./venv/*" -exec isort {} \+ -exec black {} \+
	@npx prettier --write .

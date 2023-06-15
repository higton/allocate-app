import subprocess
import os

class CommandRunner:
    def __init__(self):
        self.output_dir = './output'
        self.instances_dir = './instances'

    def run_java_jar_command(self):
        command = "java -jar target/cpsolver-itc2019-1.0-SNAPSHOT.jar configuration/default.cfg instances/input.xml " + self.output_dir
        subprocess.run(command, shell=True)

    def get_last_created_folder(self):
        folders = sorted([folder for folder in os.listdir(self.output_dir) if os.path.isdir(os.path.join(self.output_dir, folder))])
        if folders:
            last_folder = folders[-1]
            return os.path.join(self.output_dir, last_folder)
        return None

    def get_file_content(self, file_path):
        with open(file_path, "r") as f:
            return f.read()

    def get_last_created_folder_files(self):
        last_folder = self.get_last_created_folder()
        if last_folder:
            solution_xml_path = os.path.join(last_folder, "solution.xml")
            if os.path.isfile(solution_xml_path):
                file_content = self.get_file_content(solution_xml_path)
                return file_content
        return None

    def create_input_file(self, body):
        input_file_path = os.path.join(self.instances_dir, 'input.xml')
        
        # Write the body content to the input file
        with open(input_file_path, 'w') as f:
            f.write(body.decode('utf-8'))

    def execute(self, body):
        self.create_input_file(body)
        self.run_java_jar_command()
        result = self.get_last_created_folder_files()
        if result:
            return result
        else:
            return "No solution.xml file found in the last created folder."

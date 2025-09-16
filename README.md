# State Space Generator

A React single-page application for generating state spaces from variables and their domains. This tool creates the Cartesian product of all variable domains, making it useful for testing, modeling, and analysis scenarios where you need to explore all possible combinations of system states.

## Features

- **Variable Definition**: Define boolean and enum variables with custom domains
- **Real-time Generation**: Automatically generates all possible states as you define variables
- **Table View**: Clean, organized table display of generated states
- **CSV Export**: Export generated states as CSV for use in other tools
- **Copy to Clipboard**: Quick copy functionality for JSON format
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

The tool generates the Cartesian product of all variable domains. For example:
- 2 boolean variables create 2×2 = 4 states
- 3 variables with domains of size 2, 3, and 2 would create 2×3×2 = 12 states total

## Usage

1. **Add Variables**: Click "Add Variable" to create new variables
2. **Configure Variables**: 
   - Set variable names
   - Choose between Boolean or Enum types
   - For Enum types, add custom domain values
3. **View States**: The generated states appear automatically in the table
4. **Export Data**: Use the "Export" button to download states as CSV
5. **Copy Data**: Use the "Copy" button to copy states as JSON to clipboard

## Variable Types

- **Boolean**: Automatically creates a domain with `true` and `false` values
- **Enum**: Allows you to define custom domain values (e.g., colors, statuses, categories)

## Technology Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.

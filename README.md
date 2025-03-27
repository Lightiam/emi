# Dream Team Finder

A modern web application for finding and connecting with skilled professionals, featuring voice recognition capabilities.

## Features

- 🔍 Advanced search functionality
- 🎤 Voice recognition for hands-free searching
- 🌐 Multi-language support
- 📱 Responsive design
- 🔒 Secure authentication
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI Components
- React Query
- React Router DOM

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Lightiam/emi.git
   cd emi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Netlify Deployment

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Netlify:
   - `VITE_API_URL` - Your API URL
   - `VITE_GROQ_API_KEY` - Your GROQ API key

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting service

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_GROQ_API_KEY=your_groq_api_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Vite](https://vitejs.dev/) for the build tool

{
  description = "lonestarstatuary-dev-environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in rec {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [ 
            nodejs_20
            nodePackages.nodemon
            nodePackages.typescript  # Add TypeScript
            nodePackages.ts-node     # Add ts-node for TypeScript execution
            python3Full  # Use full Python installation that includes distutils
          ];
          
          shellHook = ''
            echo "Setting up Lone Star Statuary development environment..."
            
            # Function to install dependencies
            install_deps() {
              local dir=$1
              if [ -f "$dir/package.json" ]; then
                echo "Installing dependencies in $dir..."
                (cd "$dir" && npm install 2>/dev/null)
                return 0
              else
                echo "Warning: $dir/package.json not found"
                return 1
              fi
            }

            # Install shared dependencies first
            (
              if [ -f "shared/package.json" ]; then
                echo "Setting up shared package..."
                cd shared
                npm install 2>/dev/null
                npm run build 2>/dev/null
                echo "Shared package built successfully"
              else
                echo "Warning: shared/package.json not found"
              fi
            ) &
            wait

            # Install frontend and backend dependencies in parallel
            (install_deps "react-app") &
            (install_deps "server") &

            # Wait for all background processes to finish
            wait

            echo "Development environment setup complete!"

            # Only show these if the respective package.json files exist
            if [ -f "react-app/package.json" ]; then
              echo "Run 'npm start' in react-app/ to start local front-end"
            fi
            if [ -f "server/package.json" ]; then
              echo "Run 'npm run dev' in server/ to start local back-end"
            fi

            # Add shared package development instructions
            if [ -f "shared/package.json" ]; then
              echo ""
              echo "Shared Package Development:"
              echo "- Run 'npm run watch' in shared/ for automatic rebuilds"
              echo "- After changes to shared, restart frontend/backend"
            fi
          '';
        };
      }
    );
}
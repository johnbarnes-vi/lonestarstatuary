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
            python3Full  # Use full Python installation that includes distutils
          ];
          
          shellHook = ''
            echo "Setting up Lone Star Statuary development environment..."
            
            # Download dependencies
            (
              if [ -f "react-app/package.json" ]; then
                echo "Installing frontend dependencies..."
                cd react-app
                npm install 2>/dev/null
              else
                echo "Warning: react-app/package.json not found"
              fi
            ) &
            (
              if [ -f "server/package.json" ]; then
                echo "Installing backend dependencies..."
                cd server
                npm install 2>/dev/null
              else
                echo "Warning: server/package.json not found"
              fi
            ) &

            # Wait for both background processes to finish
            wait

            echo "Development environment setup complete!"

            echo "Run 'npm start' in react-app/ to start local front-end"
            echo "Run 'npm run dev' in server/ to start local back-end"
          '';
        };
      }
    );
}
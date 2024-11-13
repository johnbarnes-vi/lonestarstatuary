{
  description = "example-node-js-flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        buildNodeJs = pkgs.callPackage "${nixpkgs}/pkgs/development/web/nodejs/nodejs.nix" {
          python = pkgs.python3;
        };
        nodejs = buildNodeJs {
          enableNpm = true;
          version = "20.10.0"; # Updated to match production version
          sha256 = "sha256-Q5xxqi84woYWV7+lOOmRkaVxJYBmy/1FSFhgScgTQZA=";
        };
      in rec {
        flakedPkgs = pkgs;
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [ 
            nodejs
            nodePackages.nodemon
            stripe-cli
          ];
          shellHook = ''
            # Download dependencies
            (
              cd react-app
              npm install
            ) &
            (
              cd server
              npm install
            ) &

            # Wait for both background processes to finish
            wait
          '';
        };
      }
    );
}
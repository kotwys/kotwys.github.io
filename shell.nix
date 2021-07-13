{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = builtins.attrValues {
    inherit (pkgs) nodejs yarn openssl sqlite;
  };
}

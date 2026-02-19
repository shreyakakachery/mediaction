# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-18

### Added

- Created a dynamic molecular engine to render 3D molecules.
- Created a `useMolecule` custom hook to fetch and parse 3D SDF data from the PubChem API.
- Created a polymorphic `Target` component supporting various target geometries.
- Implemented a 3-step mechanism of action pipeline driven by a central `drugs.json` database.
- Added support for multi-bond rendering and element-specific atom coloring to preserve scientific integrity.
- Built a glassmorphism inspired UI with translucent control card with bi-directional navigation.
- Implemented loading lifecycles and state guards to manage asynchronous data fetching and prevent canvas crashes.
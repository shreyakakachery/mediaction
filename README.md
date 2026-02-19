# MediAction

An interactive 3D educational platform designed to visualize the mechanisms of drug action. This tool bridges the gap between  clinical pharmacology and data science by providing a 3D slideshow experience to help understand how common medications interact with biological targets.

## The Lights-Camera-Action Framework

Every drug in this gallery follows a three-step narrative:

### 1 Lights

- The Medication
- Spotlight the 3D molecular structure of the drug

### 2 Camera
  
- The Target
- Pan over the specific enzyme, receptor, or channel the drug targets

### 3 Action!

- The Mechanism
- View the binding process in action
- Discover the clinical outcome of the drug

#### Note:
Data is fetched client-side from the open-access PubChem PUG REST API. Since this is a public scientific resource, no sensitive API keys are stored in the frontend.


## Tech Stack

- Next.js 
- TypeScript
- Three.js (React Three Fiber)
- Tailwind CSS
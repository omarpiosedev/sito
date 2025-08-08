# SectionDivider Component - Esempi di Utilizzo

## Uso Base
```tsx
<SectionDivider text="ABOUT" />
```

## Personalizzazioni Comuni

### Direzioni diverse
```tsx
// Scorre verso sinistra
<SectionDivider text="PROJECTS" direction={false} />

// Scorre verso destra (default)
<SectionDivider text="CONTACT" direction={true} />
```

### Altezze diverse
```tsx
// Divisore sottile
<SectionDivider text="PORTFOLIO" height="h-16" />

// Divisore medio
<SectionDivider text="SERVICES" height="h-32" />

// Divisore alto
<SectionDivider text="TESTIMONIALS" height="h-48" />
```

### Velocità personalizzate
```tsx
// Molto lento
<SectionDivider text="SKILLS" velocity={30} />

// Veloce
<SectionDivider text="EXPERIENCE" velocity={150} />

// Super veloce
<SectionDivider text="BLOG" velocity={300} />
```

### Stili personalizzati
```tsx
// Testo più opaco
<SectionDivider 
  text="GALLERY" 
  textOpacity="text-white/20" 
/>

// Testo colorato
<SectionDivider 
  text="NEWS" 
  textClassName="text-4xl font-bold text-blue-500/20"
/>

// Sfondo bianco
<SectionDivider 
  text="AWARDS" 
  backgroundColor="bg-white"
  textOpacity="text-black/10"
/>
```

### Esempio completo
```tsx
<SectionDivider 
  text="PORTFOLIO"
  direction={false}
  velocity={120}
  height="h-40"
  backgroundColor="bg-gray-900"
  textOpacity="text-purple-400/15"
  numCopies={10}
  containerClassName="border-t border-b border-gray-800"
/>
```

## Implementazione nel layout
```tsx
<main>
  <Hero />
  
  <SectionDivider text="ABOUT" direction={false} />
  <About />
  
  <SectionDivider text="PROJECTS" direction={true} velocity={90} />
  <Projects />
  
  <SectionDivider text="CONTACT" direction={false} height="h-20" />
  <Contact />
</main>
```
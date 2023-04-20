declare module '@mantine/core' {
  interface MantineThemeOverride {
    other: MantineThemeOther
  }

  // Custom theme properties
  interface MantineThemeOther {
    jrcBlue: string
  }
}

export {}

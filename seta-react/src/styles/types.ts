declare module '@mantine/core' {
  type MantineThemeOverride = {
    other: MantineThemeOther
  }

  // Custom theme properties
  type MantineThemeOther = {
    jrcBlue: string
  }
}

export {}

export const AGGREGATIONS_02 = {
  date_year: [
    {
      doc_count: 3,
      year: '2002'
    },
    {
      doc_count: 0,
      year: '2003'
    },
    {
      doc_count: 0,
      year: '2004'
    },
    {
      doc_count: 0,
      year: '2005'
    },
    {
      doc_count: 0,
      year: '2006'
    },
    {
      doc_count: 0,
      year: '2007'
    },
    {
      doc_count: 0,
      year: '2008'
    },
    {
      doc_count: 0,
      year: '2009'
    },
    {
      doc_count: 0,
      year: '2010'
    },
    {
      doc_count: 0,
      year: '2011'
    },
    {
      doc_count: 0,
      year: '2012'
    },
    {
      doc_count: 0,
      year: '2013'
    },
    {
      doc_count: 0,
      year: '2014'
    },
    {
      doc_count: 0,
      year: '2015'
    },
    {
      doc_count: 0,
      year: '2016'
    },
    {
      doc_count: 0,
      year: '2017'
    },
    {
      doc_count: 0,
      year: '2018'
    },
    {
      doc_count: 2,
      year: '2019'
    },
    {
      doc_count: 0,
      year: '2020'
    },
    {
      doc_count: 0,
      year: '2021'
    },
    {
      doc_count: 3,
      year: '2022'
    }
  ],
  source: [
    {
      doc_count: 6,
      key: 'cordis'
    },
    {
      doc_count: 2,
      key: 'pubsy'
    }
  ],
  source_collection_reference: {
    sources: [
      {
        collections: [
          {
            doc_count: 2,
            key: 'event;Event',
            references: [
              {
                doc_count: 2,
                key: 'NO_CLASS'
              }
            ]
          },
          {
            doc_count: 2,
            key: 'project;Project',
            references: [
              {
                doc_count: 2,
                key: 'NO_CLASS'
              }
            ]
          },
          {
            doc_count: 2,
            key: 'topic;Topic',
            references: [
              {
                doc_count: 2,
                key: 'HORIZON'
              }
            ]
          }
        ],
        doc_count: 6,
        key: 'cordis'
      },
      {
        collections: [
          {
            doc_count: 1,
            key: 'event;Event',
            references: [
              {
                doc_count: 1,
                key: 'NO_CLASS'
              }
            ]
          },
          {
            doc_count: 1,
            key: 'project;Project',
            references: [
              {
                doc_count: 1,
                key: 'NO_CLASS'
              }
            ]
          }
        ],
        doc_count: 2,
        key: 'pubsy'
      }
    ]
  },
  taxonomy: [
    {
      doc_count: 2,
      name: 'euro_sci_voc',
      name_in_path: 'euro_sci_voc',
      subcategories: [
        {
          classifier: 'cordis',
          code: '/23',
          doc_count: 2,
          label: 'natural sciences',
          longLabel: '/natural sciences',
          name_in_path: 'natural_sciences',
          subcategories: [
            {
              classifier: 'cordis',
              code: '/23/49',
              doc_count: 2,
              label: 'biological sciences',
              longLabel: '/natural sciences/biological sciences',
              name_in_path: 'biological_sciences',
              subcategories: [
                {
                  classifier: 'cordis',
                  code: '/23/49/335',
                  doc_count: 2,
                  label: 'ecology',
                  longLabel: '/natural sciences/biological sciences/ecology',
                  name_in_path: 'ecology',
                  subcategories: [
                    {
                      classifier: 'cordis',
                      code: '/23/49/335/1009',
                      doc_count: 2,
                      label: 'ecosystems',
                      longLabel: '/natural sciences/biological sciences/ecology/ecosystems',
                      name_in_path: 'ecosystems',
                      subcategories: []
                    }
                  ]
                }
              ]
            },
            {
              classifier: 'cordis',
              code: '/23/47',
              doc_count: 2,
              label: 'computer and information sciences',
              longLabel: '/natural sciences/computer and information sciences',
              name_in_path: 'computer_and_information_sciences',
              subcategories: [
                {
                  classifier: 'cordis',
                  code: '/23/47/305',
                  doc_count: 2,
                  label: 'internet',
                  longLabel: '/natural sciences/computer and information sciences/internet',
                  name_in_path: 'internet',
                  subcategories: []
                }
              ]
            }
          ]
        },
        {
          classifier: 'cordis',
          code: '/29',
          doc_count: 2,
          label: 'social sciences',
          longLabel: '/social sciences',
          name_in_path: 'social_sciences',
          subcategories: [
            {
              classifier: 'cordis',
              code: '/29/101',
              doc_count: 2,
              label: 'sociology',
              longLabel: '/social sciences/sociology',
              name_in_path: 'sociology',
              subcategories: [
                {
                  classifier: 'cordis',
                  code: '/29/101/559',
                  doc_count: 2,
                  label: 'governance',
                  longLabel: '/social sciences/sociology/governance',
                  name_in_path: 'governance',
                  subcategories: [
                    {
                      classifier: 'cordis',
                      code: '/29/101/559/1375',
                      doc_count: 2,
                      label: 'crisis management',
                      longLabel: '/social sciences/sociology/governance/crisis management',
                      name_in_path: 'crisis_management',
                      subcategories: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

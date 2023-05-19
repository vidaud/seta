from seta_api.apis.corpus.taxonomy import Taxonomy


class TestTaxonomy:
    def test_from_tree_to_elasticsearch_format(self):
        assert Taxonomy.from_tree_to_elasticsearch_format(None) == ([], [])
        tree = [{"classifier": "cordis", "code": "00", "label": "euro_sci_voc", "longLabel": "euro_sci_voc",
                 "validated": "true", "version": "1", "name_in_path": "euro_sci_voc",
                 "subcategories": [
                     {"classifier": "cordis", "code": "/29", "label": "social sciences",
                      "longLabel": "/social sciences",
                      "validated": "true", "name_in_path": "social_sciences", "version": "1", "subcategories": [
                         {"classifier": "cordis", "code": "/29/105", "label": "educational sciences",
                          "longLabel": "/social sciences/educational sciences", "validated": "true",
                          "name_in_path": "educational_sciences", "version": "1", "subcategories": [
                             {"classifier": "cordis", "code": "/29/105/573", "label": "didactics",
                              "longLabel": "/social sciences/educational sciences/didactics", "validated": "true",
                              "name_in_path": "didactics",
                              "version": "1", "subcategories": []},
                             {"classifier": "cordis", "code": "/29/105/571", "label": "pedagogy",
                              "longLabel": "/social sciences/educational sciences/pedagogy", "validated": "true",
                              "name_in_path": "pedagogy", "version": "1", "subcategories": []}]}]}]}]
        taxonomies = [
            {"code": "00", "label": "euro_sci_voc", "longLabel": "euro_sci_voc",
             "validated": "true", "classifier": "cordis", "version": "1",
             "name": "euro_sci_voc", "name_in_path": "euro_sci_voc"},
            {
                "code": "/29",
                "label": "social sciences",
                "longLabel": "/social sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "social_sciences"
            },
            {
                "code": "/29/105",
                "label": "educational sciences",
                "longLabel": "/social sciences/educational sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "educational_sciences"
            },
            {
                "code": "/29/105/573",
                "label": "didactics",
                "longLabel": "/social sciences/educational sciences/didactics",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "didactics"
            },
            {
                "code": "/29/105/571",
                "label": "pedagogy",
                "longLabel": "/social sciences/educational sciences/pedagogy",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "pedagogy"
            }
        ]
        taxonomy_path = ["euro_sci_voc:social_sciences:educational_sciences:didactics",
                         "euro_sci_voc:social_sciences:educational_sciences:pedagogy"]

        returned_taxonomies, returned_tax_paths = Taxonomy.from_tree_to_elasticsearch_format(tree)
        assert returned_taxonomies == taxonomies
        assert returned_tax_paths == taxonomy_path

    def test_from_tree_to_elasticsearch_format_more_complex_example(self):
        tree = [{"classifier": "cordis", "code": "00", "label": "euro_sci_voc", "longLabel": "euro_sci_voc",
                 "validated": "true", "version": "1", "name_in_path": "euro_sci_voc",
                 "subcategories": [
                     {"classifier": "cordis", "code": "/29", "label": "social sciences",
                      "longLabel": "/social sciences",
                      "validated": "true", "name_in_path": "social_sciences", "version": "1", "subcategories": [
                         {"classifier": "cordis", "code": "/29/105", "label": "educational sciences",
                          "longLabel": "/social sciences/educational sciences", "validated": "true",
                          "name_in_path": "educational_sciences", "version": "1", "subcategories": [
                             {"classifier": "cordis", "code": "/29/105/573", "label": "didactics",
                              "longLabel": "/social sciences/educational sciences/didactics", "validated": "true",
                              "name_in_path": "didactics",
                              "version": "1", "subcategories": []},
                             {"classifier": "cordis", "code": "/29/105/571", "label": "pedagogy",
                              "longLabel": "/social sciences/educational sciences/pedagogy", "validated": "true",
                              "name_in_path": "pedagogy", "version": "1", "subcategories": []}]}]}]},
                {"classifier": "xxx", "code": "00", "label": "taxonomy1", "longLabel": "taxonomy1",
                 "validated": "true", "version": "1", "name_in_path": "taxonomy1", "subcategories": [
                    {"classifier": "cordis", "code": "/1", "label": "sub1", "longLabel": "/sub1",
                     "validated": "true", "name_in_path": "sub1", "version": "1", "subcategories": [
                        {"classifier": "cordis", "code": "/11", "label": "subsub1",
                         "longLabel": "/subsub1", "validated": "true",
                         "name_in_path": "subsub1", "version": "1", "subcategories": [
                            {"classifier": "cordis", "code": "/444", "label": "subsubsub4",
                             "longLabel": "/subsubsub4", "validated": "true",
                             "name_in_path": "subsubsub4",
                             "version": "1", "subcategories": []},
                            {"classifier": "cordis", "code": "/555", "label": "subsubsub5",
                             "longLabel": "/subsubsub5", "validated": "true",
                             "name_in_path": "subsubsub5",
                             "version": "1", "subcategories": []}]}]},
                    {"classifier": "cordis", "code": "/2", "label": "sub2", "longLabel": "/sub2",
                     "validated": "true", "name_in_path": "sub2", "version": "1", "subcategories": [
                        {"classifier": "cordis", "code": "/33", "label": "subsub3",
                         "longLabel": "/subsub3", "validated": "true",
                         "name_in_path": "subsub3", "version": "1", "subcategories": []}]}
                ]}
                ]
        taxonomies = [
            {"code": "00", "label": "euro_sci_voc", "longLabel": "euro_sci_voc",
             "validated": "true", "classifier": "cordis", "version": "1",
             "name": "euro_sci_voc", "name_in_path": "euro_sci_voc"},
            {
                "code": "/29",
                "label": "social sciences",
                "longLabel": "/social sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "social_sciences"
            },
            {
                "code": "/29/105",
                "label": "educational sciences",
                "longLabel": "/social sciences/educational sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "educational_sciences"
            },
            {
                "code": "/29/105/573",
                "label": "didactics",
                "longLabel": "/social sciences/educational sciences/didactics",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "didactics"
            },
            {
                "code": "/29/105/571",
                "label": "pedagogy",
                "longLabel": "/social sciences/educational sciences/pedagogy",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "pedagogy"
            },
            {"classifier": "xxx",
             "code": "00",
             "label": "taxonomy1",
             "longLabel": "taxonomy1",
             "name": "taxonomy1",
             "name_in_path": "taxonomy1",
             "validated": "true",
             "version": "1"},

            {"classifier": "cordis",
             "code": "/1",
             "label": "sub1",
             "longLabel": "/sub1",
             "name": "taxonomy1",
             "name_in_path": "sub1",
             "validated": "true",
             "version": "1"},
            {"classifier": "cordis",
             "code": "/11",
             "label": "subsub1",
             "longLabel": "/subsub1",
             "name": "taxonomy1",
             "name_in_path": "subsub1",
             "validated": "true",
             "version": "1"},
            {"classifier": "cordis",
             "code": "/444",
             "label": "subsubsub4",
             "longLabel": "/subsubsub4",
             "name": "taxonomy1",
             "name_in_path": "subsubsub4",
             "validated": "true",
             "version": "1"},
            {"classifier": "cordis",
             "code": "/555",
             "label": "subsubsub5",
             "longLabel": "/subsubsub5",
             "name": "taxonomy1",
             "name_in_path": "subsubsub5",
             "validated": "true",
             "version": "1"},
            {"classifier": "cordis",
             "code": "/2",
             "label": "sub2",
             "longLabel": "/sub2",
             "name": "taxonomy1",
             "name_in_path": "sub2",
             "validated": "true",
             "version": "1"},
            {"classifier": "cordis",
             "code": "/33",
             "label": "subsub3",
             "longLabel": "/subsub3",
             "name": "taxonomy1",
             "name_in_path": "subsub3",
             "validated": "true",
             "version": "1"}
        ]
        taxonomy_path = ["euro_sci_voc:social_sciences:educational_sciences:didactics",
                         "euro_sci_voc:social_sciences:educational_sciences:pedagogy",
                         "taxonomy1:sub1:subsub1:subsubsub4",
                         "taxonomy1:sub1:subsub1:subsubsub5",
                         "taxonomy1:sub2:subsub3"]
        returned_taxonomies, returned_tax_paths = Taxonomy.from_tree_to_elasticsearch_format(tree)
        assert returned_taxonomies == taxonomies
        assert returned_tax_paths == taxonomy_path

    def test_from_tree_to_elasticsearch_format_more_complex_example2(self):
        tree = [
            {
                "classifier": "cordis", "code": "00", "label": "euro_sci_voc", "longLabel": "euro_sci_voc",
                "validated": "true", "version": "1", "name_in_path": "euro_sci_voc",
                "subcategories": [
                    {
                        "classifier": "cordis",
                        "code": "/27",
                        "label": "agricultural sciences",
                        "longLabel": "/agricultural sciences",
                        "name_in_path": "agricultural_sciences",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/27/81",
                                "label": "agriculture, forestry, and fisheries",
                                "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries",
                                "name_in_path": "agriculture_forestry_and_fisheries",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/27/81/30021",
                                        "label": "agriculture",
                                        "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries/agriculture",
                                        "name_in_path": "agriculture",
                                        "subcategories": [
                                            {
                                                "classifier": "cordis",
                                                "code": "/27/81/30021/499",
                                                "label": "horticulture",
                                                "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries/agriculture/horticulture",
                                                "name_in_path": "horticulture",
                                                "subcategories": [
                                                    {
                                                        "classifier": "cordis",
                                                        "code": "/27/81/30021/499/1287",
                                                        "label": "fruit growing",
                                                        "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries/agriculture/horticulture/fruit growing",
                                                        "name_in_path": "fruit_growing",
                                                        "subcategories": [],
                                                        "validated": "true",
                                                        "version": "1"
                                                    },
                                                    {
                                                        "classifier": "cordis",
                                                        "code": "/27/81/30021/499/69103681",
                                                        "label": "vegetable growing",
                                                        "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries/agriculture/horticulture/vegetable growing",
                                                        "name_in_path": "vegetable_growing",
                                                        "subcategories": [],
                                                        "validated": "true",
                                                        "version": "1"
                                                    }
                                                ],
                                                "validated": "true",
                                                "version": "1"
                                            }
                                        ],
                                        "validated": "true",
                                        "version": "1"
                                    }
                                ],
                                "validated": "true",
                                "version": "1"
                            }
                        ],
                        "validated": "true",
                        "version": "1"
                    },
                    {
                        "classifier": "cordis",
                        "code": "/25",
                        "label": "engineering and technology",
                        "longLabel": "/engineering and technology",
                        "name_in_path": "engineering_and_technology",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/25/59",
                                "label": "other engineering and technologies",
                                "longLabel": "/engineering and technology/other engineering and technologies",
                                "name_in_path": "other_engineering_and_technologies",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/25/59/377",
                                        "label": "food technology",
                                        "longLabel": "/engineering and technology/other engineering and technologies/food technology",
                                        "name_in_path": "food_technology",
                                        "subcategories": [],
                                        "validated": "true",
                                        "version": "1"
                                    }
                                ],
                                "validated": "true",
                                "version": "1"
                            }
                        ],
                        "validated": "true",
                        "version": "1"
                    },
                    {
                        "classifier": "cordis",
                        "code": "/23",
                        "label": "natural sciences",
                        "longLabel": "/natural sciences",
                        "name_in_path": "natural_sciences",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/23/43",
                                "label": "physical sciences",
                                "longLabel": "/natural sciences/physical sciences",
                                "name_in_path": "physical_sciences",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/23/43/273",
                                        "label": "acoustics",
                                        "longLabel": "/natural sciences/physical sciences/acoustics",
                                        "name_in_path": "acoustics",
                                        "subcategories": [
                                            {
                                                "classifier": "cordis",
                                                "code": "/23/43/273/813",
                                                "label": "ultrasound",
                                                "longLabel": "/natural sciences/physical sciences/acoustics/ultrasound",
                                                "name_in_path": "ultrasound",
                                                "subcategories": [],
                                                "validated": "true",
                                                "version": "1"
                                            }
                                        ],
                                        "validated": "true",
                                        "version": "1"
                                    }
                                ],
                                "validated": "true",
                                "version": "1"
                            }
                        ],
                        "validated": "true",
                        "version": "1"
                    },
                    {
                        "classifier": "cordis",
                        "code": "/29",
                        "label": "social sciences",
                        "longLabel": "/social sciences",
                        "name_in_path": "social_sciences",
                        "subcategories": [
                            {
                                "classifier": "cordis",
                                "code": "/29/91",
                                "label": "economics and business",
                                "longLabel": "/social sciences/economics and business",
                                "name_in_path": "economics_and_business",
                                "subcategories": [
                                    {
                                        "classifier": "cordis",
                                        "code": "/29/91/523",
                                        "label": "business and management",
                                        "longLabel": "/social sciences/economics and business/business and management",
                                        "name_in_path": "business_and_management",
                                        "subcategories": [
                                            {
                                                "classifier": "cordis",
                                                "code": "/29/91/523/1313",
                                                "label": "employment",
                                                "longLabel": "/social sciences/economics and business/business and management/employment",
                                                "name_in_path": "employment",
                                                "subcategories": [],
                                                "validated": "true",
                                                "version": "1"
                                            }
                                        ],
                                        "validated": "true",
                                        "version": "1"
                                    }
                                ],
                                "validated": "true",
                                "version": "1"
                            }
                        ],
                        "validated": "true",
                        "version": "1"
                    }
                ]
            }
        ]
        taxonomies = [
            {"classifier": "cordis",
             "code": "00",
             "label": "euro_sci_voc",
             "longLabel": "euro_sci_voc",
             "name": "euro_sci_voc",
             "name_in_path": "euro_sci_voc",
             "validated": "true",
             "version": "1"},
            {
                "code": "/27",
                "label": "agricultural sciences",
                "longLabel": "/agricultural sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "agricultural_sciences"
            },
            {
                "code": "/27/81",
                "label": "agriculture, forestry, and fisheries",
                "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "agriculture_forestry_and_fisheries"
            },
            {
                "code": "/27/81/30021",
                "label": "agriculture",
                "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries/agriculture",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "agriculture"
            },
            {
                "code": "/27/81/30021/499",
                "label": "horticulture",
                "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries/agriculture/horticulture",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "horticulture"
            },
            {
                "code": "/27/81/30021/499/1287",
                "label": "fruit growing",
                "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries/agriculture/horticulture/fruit growing",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "fruit_growing"
            },
            {
                "code": "/27/81/30021/499/69103681",
                "label": "vegetable growing",
                "longLabel": "/agricultural sciences/agriculture, forestry, and fisheries/agriculture/horticulture/vegetable growing",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "vegetable_growing"
            },
            {
                "code": "/25",
                "label": "engineering and technology",
                "longLabel": "/engineering and technology",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "engineering_and_technology"
            },
            {
                "code": "/25/59",
                "label": "other engineering and technologies",
                "longLabel": "/engineering and technology/other engineering and technologies",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "other_engineering_and_technologies"
            },
            {
                "code": "/25/59/377",
                "label": "food technology",
                "longLabel": "/engineering and technology/other engineering and technologies/food technology",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "food_technology"
            },
            {
                "code": "/23",
                "label": "natural sciences",
                "longLabel": "/natural sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "natural_sciences"
            },
            {
                "code": "/23/43",
                "label": "physical sciences",
                "longLabel": "/natural sciences/physical sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "physical_sciences"
            },
            {
                "code": "/23/43/273",
                "label": "acoustics",
                "longLabel": "/natural sciences/physical sciences/acoustics",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "acoustics"
            },
            {
                "code": "/23/43/273/813",
                "label": "ultrasound",
                "longLabel": "/natural sciences/physical sciences/acoustics/ultrasound",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "ultrasound"
            },
            {
                "code": "/29",
                "label": "social sciences",
                "longLabel": "/social sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "social_sciences"
            },
            {
                "code": "/29/91",
                "label": "economics and business",
                "longLabel": "/social sciences/economics and business",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "economics_and_business"
            },
            {
                "code": "/29/91/523",
                "label": "business and management",
                "longLabel": "/social sciences/economics and business/business and management",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "business_and_management"
            },
            {
                "code": "/29/91/523/1313",
                "label": "employment",
                "longLabel": "/social sciences/economics and business/business and management/employment",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "employment"
            }
        ]
        taxonomy_path = [
            "euro_sci_voc:agricultural_sciences:agriculture_forestry_and_fisheries:agriculture:horticulture:fruit_growing",
            "euro_sci_voc:agricultural_sciences:agriculture_forestry_and_fisheries:agriculture:horticulture:vegetable_growing",
            "euro_sci_voc:engineering_and_technology:other_engineering_and_technologies:food_technology",
            "euro_sci_voc:natural_sciences:physical_sciences:acoustics:ultrasound",
            "euro_sci_voc:social_sciences:economics_and_business:business_and_management:employment",
        ]
        returned_taxonomies, returned_tax_paths = Taxonomy.from_tree_to_elasticsearch_format(tree)
        assert returned_taxonomies == taxonomies
        assert returned_tax_paths == taxonomy_path

    def test_create_tree_from_elasticsearch_format(self):
        tree = [{"classifier": "cordis", "code": "00", "label": "euro_sci_voc", "longLabel": "euro_sci_voc",
                 "validated": "true", "version": "1", "name_in_path": "euro_sci_voc",
                 "subcategories": [
                     {"classifier": "cordis", "code": "/29", "label": "social sciences",
                      "longLabel": "/social sciences",
                      "validated": "true", "name_in_path": "social_sciences", "version": "1", "subcategories": [
                         {"classifier": "cordis", "code": "/29/105", "label": "educational sciences",
                          "longLabel": "/social sciences/educational sciences", "validated": "true",
                          "name_in_path": "educational_sciences", "version": "1", "subcategories": [
                             {"classifier": "cordis", "code": "/29/105/573", "label": "didactics",
                              "longLabel": "/social sciences/educational sciences/didactics", "validated": "true",
                              "name_in_path": "didactics",
                              "version": "1", "subcategories": []},
                             {"classifier": "cordis", "code": "/29/105/571", "label": "pedagogy",
                              "longLabel": "/social sciences/educational sciences/pedagogy", "validated": "true",
                              "name_in_path": "pedagogy", "version": "1", "subcategories": []}]}]}]}]
        taxonomies = [
            {"code": "00",
             "label": "euro_sci_voc",
             "longLabel": "euro_sci_voc",
             "validated": "true",
             "classifier": "cordis",
             "version": "1",
             "name": "euro_sci_voc",
             "name_in_path": "euro_sci_voc"
             },
            {
                "code": "/29",
                "label": "social sciences",
                "longLabel": "/social sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "social_sciences"
            },
            {
                "code": "/29/105",
                "label": "educational sciences",
                "longLabel": "/social sciences/educational sciences",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "educational_sciences"
            },
            {
                "code": "/29/105/573",
                "label": "didactics",
                "longLabel": "/social sciences/educational sciences/didactics",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "didactics"
            },
            {
                "code": "/29/105/571",
                "label": "pedagogy",
                "longLabel": "/social sciences/educational sciences/pedagogy",
                "validated": "true",
                "classifier": "cordis",
                "version": "1",
                "name": "euro_sci_voc",
                "name_in_path": "pedagogy"
            }
        ]
        taxonomy_path = ["euro_sci_voc:social_sciences:educational_sciences:didactics",
                         "euro_sci_voc:social_sciences:educational_sciences:pedagogy"]
        tax = Taxonomy()
        assert tax.create_tree_from_elasticsearch_format(None, None) == []
        assert tax.create_tree_from_elasticsearch_format(taxonomies, None) == []
        assert tax.create_tree_from_elasticsearch_format(None, taxonomy_path) == []

        tax.create_tree_from_elasticsearch_format(taxonomies, taxonomy_path)
        returned_tree = tax.tree
        assert returned_tree == tree

    def test_create_tree_from_elasticsearch_with_error(self):
        taxonomies = [
            {"code": "00",
             "label": "euro_sci_voc",
             "longLabel": "euro_sci_voc",
             "validated": "true",
             "classifier": "cordis",
             "version": "1",
             "name": "euro_sci_voc",
             "name_in_path": "euro_sci_voc"
             }]
        taxonomy_paths = ["euro_sci_voc:natural_sciences:physical_sciences:acoustics:ultrasound"]

        tax = Taxonomy()
        tax.create_tree_from_elasticsearch_format(taxonomies, taxonomy_paths)
        returned_tree = tax.tree
        assert returned_tree == []

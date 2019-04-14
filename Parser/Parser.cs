using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Text.RegularExpressions;


namespace ICD10Parser {
    public class Parser {


        // normalize data
        public static Chapter ParseXml(string path, string categoryId) {

            XDocument xml = XDocument.Load(path);
            var chapterXml = xml.Root.Elements("chapter")
                                     .Where(c => (string)c.Element("name").Value == categoryId)
                                     .SingleOrDefault();

            List<Index> sectionIdx = chapterXml.Element("sectionIndex")
                                            .Elements("sectionRef")
                                            .Select(s => new Index{
                                                Alpha = s.Attribute("first").Value.ToCharArray()[0].ToString(),
                                                First = Convert.ToDouble(new String(s.Attribute("first").Value.ToCharArray(), 1, 2)),
                                                Last = Convert.ToDouble(Convert.ToInt32(new String(s.Attribute("last").Value.ToCharArray(), 1, 2))),
                                                Id = s.Attribute("id").Value,
                                                Digit = 3
                                            }).ToList();


            List<Section> sections = new List<Section>();
            var diagSections = chapterXml.Elements("section").Where(s => s.Element("diag") != null);
            
            foreach (XElement s in diagSections) {
                Index idx = sectionIdx.Find(x => x.Id == s.Attribute("id").Value);

                sections.Add(new Section() {
                    Description = s.Element("desc").Value.Trim(),
                    Id = s.Attribute("id").Value,
                    Children = ParseDiagnosis(s.Elements("diag"), 3, null, null),
                    Index = idx,
                    Notes = ParseNotes(s.Element("notes"), s.Element("includes")),
                    Rules = ParseRules(s.Element("useAdditionalCode"), s.Element("codeFirst"), s.Element("excludes1"), s.Element("excludes2"))
                });
            }

            var chapter = new Chapter() {
                Id = categoryId,
                Description = chapterXml.Element("desc").Value,
                Sections = sections
            };

            return chapter;
        }

        public static List<Diagnosis> ParseDiagnosis(IEnumerable<XElement> diags, int digit, string parentDescription, List<SeventhDigit> seventh) {

            Func<XElement, Diagnosis> parse = new Func<XElement, Diagnosis>(
                x => {
                    var desc = CleanDescription((string)x.Element("desc").Value.Trim(), parentDescription);
                    var decendantDiags = x.Elements("diag");
                    bool placeholder = false;

                    if (x.Attribute("placeholder") != null) {
                        placeholder = true;
                    }     

                    var sev = x.Element("sevenChrDef") == null ? null : (ParseSeventhDigit(x.Element("sevenChrDef")));
                    seventh = (sev != null) ? sev : seventh;

                    var children = (decendantDiags == null) ? null : ParseDiagnosis(decendantDiags, digit + 1, desc, sev);

                    char[] chars = x.Element("name").Value.ToCharArray();
                    string alpha = x.Element("name").Value.ToCharArray()[0].ToString();
                    string first = Regex.Replace(new String(chars, 1, chars.Length - 1), "[A-Za-z]", "0");
   
                    var dx = new Diagnosis() {
                        Id = x.Element("name").Value,
                        Description = desc,
                        Placeholder = placeholder,

                        Children = children,
                        Index = new Index() {
                            Id = x.Element("name").Value,
                            Digit = digit,
                            Alpha = alpha,
                            First = Convert.ToDouble(first),
                            Last = Convert.ToDouble(first)
                        },
                        Notes = ParseNotes(x.Element("notes"), x.Element("includes")),
                        Rules = ParseRules(x.Element("useAdditionalCode"), x.Element("codeFirst"), x.Element("excludes1"), x.Element("excludes2"))
                    };

                    if (children.Count() == 0 && seventh != null) {
                        var dig = BuildPlaceholders(dx, seventh);
                    }

                    return dx;
                }
            );

            return diags.Select(x => parse(x)).ToList();
        }

        public static List<SeventhDigit> ParseSeventhDigit(XElement seventhDigit) {
            List<SeventhDigit> digits = new List<SeventhDigit>();

            foreach (XElement extension in seventhDigit.Elements("extension")) {
                digits.Add(new SeventhDigit() {
                    Character = extension.Attribute("char").Value,
                    Description = extension.Value
                });
            }
            return digits;
        }

        public static Rule ParseRules(XElement useCodes, XElement codeFirst, XElement excludes1, XElement excludes2) {

            Rule rule = new Rule();
            rule.CodeFirst = (codeFirst == null) ? null : new List<string>(codeFirst.Elements("note").Select<XElement, String>(u => u.Value));
            rule.UseAdditionalCodes = (useCodes == null) ? null : new List<string>(useCodes.Elements("note").Select<XElement, String>(u => u.Value));
            rule.Excludes1 = (excludes1 == null) ? null : new List<string>(excludes1.Elements("note").Select<XElement, String>(u => u.Value));
            rule.Excludes2 = (excludes2 == null) ? null : new List<string>(excludes2.Elements("note").Select<XElement, String>(u => u.Value));

            return rule;
        }

        public static Note ParseNotes(XElement notes, XElement includes) {

            Note note = new Note();
            note.Notes = (notes == null) ? null : new List<string>(notes.Elements("note").Select<XElement, String>(u => u.Value));
            note.Includes = (includes == null) ? null : new List<string>(includes.Elements("note").Select<XElement, String>(u => u.Value));

            return note;
        }


        public static Diagnosis BuildPlaceholders(Diagnosis dx, List<SeventhDigit> seventh) {

            int tmpDigit = dx.Index.Digit;
            Diagnosis _parentPtr = dx;
            Diagnosis _currentPtr = null;

            if (dx.Index.Digit < 7) {

                tmpDigit++;

                while (tmpDigit < 7) {
                    _currentPtr = new Diagnosis() { 
                        Description = "Placeholder", 
                        Id = "X", 
                        Index = new Index { 
                            Digit = _parentPtr.Index.Digit + 1,
                            Alpha = dx.Index.Alpha,
                            First = 0,
                            Last = 0,
                            Id = "X"
                        }, 
                        Children = new List<Diagnosis>() };

                    _parentPtr.Children.Add(_currentPtr);

                    // update pointer
                    _parentPtr = _currentPtr;
                    tmpDigit++;
                }
            }

            foreach (var extension in seventh) {
                _parentPtr.Children.Add(new Diagnosis() { 
                    Description = extension.Description, 
                    Id = extension.Character, 
                    Index = new Index { 
                        Digit = _parentPtr.Index.Digit + 1,
                        Alpha = dx.Index.Alpha,
                        First = 0,
                        Last = 0,
                        Id = "X"
                    }
                });
            }

            return _parentPtr;
        }

        public static string CleanDescription(string description, string parentDescription) {

            if (string.IsNullOrEmpty(parentDescription)) {
                return description;
            } else {
                return description.Replace(parentDescription, "").Replace(",", "");
            }
        }

        
    }
}

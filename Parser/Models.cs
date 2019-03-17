using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ICD10Parser {

    public class Chapter {
        public string Id { get; set; }
        public string Description { get; set; }

        public List<Section> Sections { get; set; }
    }

    public class Section {
        public string Id { get; set; }
        public string Description { get; set; }

        public Index Index { get; set; }
        public Rule Rules { get; set; }
        public Note Notes { get; set; }

        public List<Diagnosis> Children { get; set; }
    }

    public class Diagnosis {
        public string Id { get; set; }
        public string Description { get; set; }
        public bool Placeholder { get; set; }

        public Index Index { get; set; }
        public Rule Rules { get; set; }
        public Note Notes { get; set; }

        public List<Diagnosis> Children { get; set; }
    }

    public class Index {
        public string Id { get; set; }
        public int Digit { get; set; }

        public string Alpha { get; set; }
        public double First { get; set; }
        public double Last { get; set; }
    }

    public class Rule {

        public List<string> CodeFirst { get; set; }
        public List<string> UseAdditionalCodes { get; set; }
        public List<string> Excludes1 { get; set; }
        public List<string> Excludes2 { get; set; }
    }

    public class Note {

        public List<string> Notes { get; set; }
        public List<string> Includes { get; set; }
    }

    public class SeventhDigit {
        public string Character { get; set; }
        public string Description { get; set; }
    }

    public class ScrubLogic {
        public List<string> Excludes1 { get; set; }
        public List<string> Excludes2 { get; set; }
    }

}

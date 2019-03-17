using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

using System.Xml.Linq;
using Newtonsoft.Json;

namespace ICD10Parser {
    public partial class Driver : Form {
        public Driver() {
            InitializeComponent();
        }

        private const string _xmlPath = "../../icd10cm_tabular_2017.xml";
        
        private string _categoryId = "13";
        private Chapter _currChapter = null;

        private void Driver_Load(object sender, EventArgs e) {
            cboChapter.SelectedItem = _categoryId;
        }

        private void cboChapter_SelectedIndexChanged(object sender, EventArgs e) {
            _categoryId = cboChapter.SelectedItem as string;
            BuildChapter(_xmlPath, _categoryId);
        }


        private void btnExport_Click(object sender, EventArgs e) {
            string json = JsonConvert.SerializeObject(_currChapter);
            System.IO.File.WriteAllText(string.Format("icd10_{0}.json", _categoryId), json);
        }



        public void BuildChapter(string path, string chapterId) {
            try {
                _currChapter = Parser.ParseXml(path, chapterId);

                TreeNode root = new TreeNode(_currChapter.Description);
                foreach (Section section in _currChapter.Sections) {
                    TreeNode sectionNode = new TreeNode(string.Format("{1}: {0}", section.Description, section.Id));
                    BuildTree(sectionNode, section.Children);
                    root.Nodes.Add(sectionNode);
                }

                tvDiagnosis.Nodes.Clear();
                tvDiagnosis.Nodes.Add(root);
            } catch (Exception ex) {
                throw ex;
            }
        
        }

        public void BuildTree(TreeNode node, List<Diagnosis> diagnosis) {

            if (diagnosis == null) {
                return;
            }

            foreach (Diagnosis diag in diagnosis) {

                TreeNode diagNode = new TreeNode(string.Format("[{2}] -- {1}: {0}", (diag.Placeholder) ? "Placeholder" : diag.Description, diag.Id, diag.Index.Digit));
                diagNode.Tag = diag.Id;
                node.Nodes.Add(diagNode);

                BuildTree(diagNode, diag.Children);
            }
        }




    }

}

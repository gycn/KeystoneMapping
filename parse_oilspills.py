import argparse
from pykml import parser
from lxml import etree

p = argparse.ArgumentParser(description="file to parse the oil spill KML file")
p.add_argument('-f', '--file', help="filepath to the kml file")
p.add_argument('-o', '--output', help="output file")
args = p.parse_args()

def remove_oil_spills(filename):
    with open(filename) as f:
        d = parser.parse(f)
        doc = d.getroot()
        for i in doc.Document.iterchildren():
            if hasattr(i, 'name'):
                if 'OIL' not in str(i.name):
                    print(i.name)
                    doc.Document.remove(i)
        return etree.tostring(d, pretty_print=True)

with open(args.output, 'w') as f:
    f.write(remove_oil_spills(args.file))
    f.close()

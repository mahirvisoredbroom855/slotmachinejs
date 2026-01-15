#!/usr/bin/perl
use strict;
use warnings;
use JSON;
use XML::Simple;

# JSON to XML Converter for SlotLab Export Files
# Usage: perl json_to_xml.pl input.json output.xml

if (@ARGV != 2) {
    die "Usage: perl json_to_xml.pl <input.json> <output.xml>\n";
}

my ($input_file, $output_file) = @ARGV;

# Read JSON file
open(my $fh, '<', $input_file) or die "Cannot open $input_file: $!";
my $json_text = do { local $/; <$fh> };
close($fh);

# Parse JSON
my $data = decode_json($json_text);

# Convert to XML
my $xml = XML::Simple->new(RootName => 'slotlab_export');
my $xml_output = $xml->XMLout($data, 
    NoAttr => 1,
    XMLDecl => '<?xml version="1.0" encoding="UTF-8"?>'
);

# Write XML file
open(my $out, '>', $output_file) or die "Cannot write to $output_file: $!";
print $out $xml_output;
close($out);

print "✅ Converted $input_file to $output_file\n";
print "📊 Total spins in export: " . scalar(@{$data->{spins}}) . "\n";
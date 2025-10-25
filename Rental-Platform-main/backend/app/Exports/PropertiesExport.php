<?php

namespace App\Exports;

use App\Models\Property;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PropertiesExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Property::with('owner')->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Title',
            'Owner',
            'City',
            'Property Type',
            'Rental Type',
            'Bedrooms',
            'Bathrooms',
            'Price per Night',
            'Price per Month',
            'Status',
            'Featured',
            'Created At',
        ];
    }

    /**
     * @param mixed $property
     * @return array
     */
    public function map($property): array
    {
        return [
            $property->id,
            $property->title,
            $property->owner?->name ?? 'N/A',
            $property->city,
            $property->property_type,
            $property->rental_type,
            $property->bedrooms,
            $property->bathrooms,
            $property->price_per_night,
            $property->price_per_month ?? 'N/A',
            $property->status,
            $property->is_featured ? 'Yes' : 'No',
            $property->created_at->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}

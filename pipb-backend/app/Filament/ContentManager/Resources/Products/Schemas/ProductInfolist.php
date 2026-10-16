<?php

namespace App\Filament\ContentManager\Resources\Products\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;

class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Produk')
                    ->schema([
                        TextEntry::make('name')
                            ->label('Nama Produk')
                            ->weight('bold')
                            ->columnSpanFull(),

                        TextEntry::make('user.name')
                            ->label('Nama Mahasiswa')
                            ->placeholder('Tidak diketahui'),

                        TextEntry::make('category.name')
                            ->label('Kategori')
                            ->placeholder('Tidak ada kategori'),

                        TextEntry::make('description')
                            ->label('Deskripsi')
                            ->placeholder('Tidak ada deskripsi')
                            ->columnSpanFull(),

                        TextEntry::make('initial_fund')
                            ->label('Dana Awal')
                            ->money('IDR', locale: 'id')
                            ->placeholder('-'),

                        TextEntry::make('investment_amount')
                            ->label('Dana Investasi')
                            ->money('IDR', locale: 'id')
                            ->placeholder('-'),

                        TextEntry::make('target_fund')
                            ->label('Target Pendanaan')
                            ->money('IDR', locale: 'id')
                            ->placeholder('-'),

                        TextEntry::make('launch_date')
                            ->label('Tanggal Peluncuran')
                            ->date('d F Y')
                            ->placeholder('Belum ditentukan'),

                        TextEntry::make('approval_status')
                            ->label('Status Persetujuan')
                            ->badge()
                            ->formatStateUsing(
                                fn (?string $state): string => match ($state) {
                                    'pending_review' => 'Menunggu Review',
                                    'needs_revision' => 'Perlu Revisi',
                                    'rejected' => 'Ditolak',
                                    'published' => 'Dipublikasikan',
                                    default => $state ?? '-',
                                }
                            )
                            ->color(
                                fn (?string $state): string => match ($state) {
                                    'pending_review' => 'warning',
                                    'needs_revision' => 'info',
                                    'rejected' => 'danger',
                                    'published' => 'success',
                                    default => 'gray',
                                }
                            ),

                        TextEntry::make('launch_status')
                            ->label('Status Peluncuran')
                            ->badge()
                            ->placeholder('-'),

                        TextEntry::make('rejection_reason')
                            ->label('Alasan Penolakan atau Revisi')
                            ->placeholder('Tidak ada catatan')
                            ->columnSpanFull(),

                        TextEntry::make('created_at')
                            ->label('Dibuat Pada')
                            ->dateTime('d F Y, H:i')
                            ->placeholder('-'),

                        TextEntry::make('updated_at')
                            ->label('Terakhir Diperbarui')
                            ->dateTime('d F Y, H:i')
                            ->placeholder('-'),
                    ])
                    ->columns(2),

                Section::make('Galeri Gambar Produk')
                    ->schema([
                        ImageEntry::make('images.image_path')
                            ->label('Gambar Produk')
                            ->disk('public')
                            ->height(200)
                            ->columnSpanFull(),
                    ]),

                Section::make('Dokumen Pendukung')
                    ->schema([
                        TextEntry::make('documents.file_name')
                            ->label('Nama Dokumen')
                            ->listWithLineBreaks()
                            ->placeholder('Belum ada dokumen'),

                        TextEntry::make('documents.file_type')
                            ->label('Tipe Dokumen')
                            ->listWithLineBreaks()
                            ->placeholder('-'),

                        TextEntry::make('documents.file_size')
                            ->label('Ukuran Dokumen')
                            ->formatStateUsing(
                                fn ($state): string => $state !== null
                                    ? number_format(
                                        (int) $state / 1024,
                                        2,
                                        ',',
                                        '.'
                                    ) . ' KB'
                                    : '-'
                            )
                            ->listWithLineBreaks()
                            ->placeholder('-'),

                        TextEntry::make('documents.file_path')
                            ->label('Tautan Dokumen')
                            ->formatStateUsing(
                                fn ($state): string => filled($state)
                                    ? 'Buka / Unduh Dokumen'
                                    : 'Dokumen tidak tersedia'
                            )
                            ->url(
                                fn ($state): ?string => filled($state)
                                    ? Storage::disk('public')->url($state)
                                    : null
                            )
                            ->openUrlInNewTab()
                            ->listWithLineBreaks()
                            ->color('primary')
                            ->placeholder('Belum ada dokumen')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Ringkasan Penilaian')
                    ->schema([
                        TextEntry::make('jumlah_penilaian')
                            ->label('Jumlah Penilaian')
                            ->state(
                                fn ($record): int => $record->votes()->count()
                            ),

                        TextEntry::make('rata_rata_nilai')
                            ->label('Rata-rata Nilai')
                            ->state(
                                fn ($record): string => $record->votes()->exists()
                                    ? number_format(
                                        (float) $record->votes()->avg('overall_score'),
                                        2,
                                        ',',
                                        '.'
                                    )
                                    : 'Belum dinilai'
                            ),

                        TextEntry::make('votes.feedback')
                            ->label('Feedback Content Manager')
                            ->listWithLineBreaks()
                            ->placeholder('Belum ada feedback')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}
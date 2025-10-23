<?php

namespace App\Filament\Resources\Conversations\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ConversationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('property.title')
                    ->label('Property')
                    ->searchable()
                    ->sortable(),
                
                TextColumn::make('subject')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                
                TextColumn::make('conversation_type')
                    ->label('Type')
                    ->badge()
                    ->colors([
                        'info' => 'inquiry',
                        'success' => 'booking',
                        'warning' => 'support',
                        'danger' => 'complaint',
                    ])
                    ->sortable(),
                
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'success' => 'active',
                        'gray' => 'archived',
                        'danger' => 'closed',
                    ])
                    ->sortable(),
                
                TextColumn::make('total_messages')
                    ->label('Messages')
                    ->numeric()
                    ->sortable(),
                
                TextColumn::make('last_message_at')
                    ->label('Last Activity')
                    ->dateTime()
                    ->sortable()
                    ->since(),
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Active',
                        'archived' => 'Archived',
                        'closed' => 'Closed',
                    ]),
                
                SelectFilter::make('conversation_type')
                    ->label('Type')
                    ->options([
                        'inquiry' => 'Inquiry',
                        'booking' => 'Booking',
                        'support' => 'Support',
                        'complaint' => 'Complaint',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('last_message_at', 'desc');
    }
}
